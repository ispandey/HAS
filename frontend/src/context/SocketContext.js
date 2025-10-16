import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// Create context
const SocketContext = createContext();

// Socket Provider Component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated, token } = useAuth();

  useEffect(() => {
    let socketInstance = null;

    if (isAuthenticated && user && token) {
      // Initialize socket connection
      socketInstance = io(process.env.REACT_APP_API_URL || 'http://localhost:5001', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      // Connection event handlers
      socketInstance.on('connect', () => {
        console.log('Connected to server');
        setConnected(true);
        
        // Join user-specific room
        if (user.role === 'student') {
          socketInstance.emit('join-room', `student_${user.id}`);
        } else if (user.role === 'hostel_owner') {
          socketInstance.emit('join-room', `owner_${user.id}`);
        } else if (user.role === 'admin') {
          socketInstance.emit('join-room', 'admin');
        }
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from server');
        setConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setConnected(false);
      });

      // Real-time notification handlers
      socketInstance.on('new_booking_request', (data) => {
        if (user.role === 'hostel_owner') {
          toast.info(`New booking request from ${data.studentName} for ${data.hostelName}`, {
            autoClose: 8000,
            onClick: () => {
              // Navigate to bookings page
              window.location.href = '/owner/bookings';
            }
          });
        }
      });

      socketInstance.on('booking_response', (data) => {
        if (user.role === 'student') {
          const message = data.status === 'approved' 
            ? `Your booking request for ${data.hostelName} has been approved!`
            : `Your booking request for ${data.hostelName} has been rejected.`;
          
          const toastType = data.status === 'approved' ? 'success' : 'error';
          
          toast[toastType](message, {
            autoClose: 10000,
            onClick: () => {
              window.location.href = '/student/bookings';
            }
          });
        }
      });

      socketInstance.on('booking_cancelled', (data) => {
        const message = data.cancelledBy === 'student' 
          ? 'A student has cancelled their booking request'
          : 'Your booking has been cancelled by the hostel owner';
          
        toast.warning(message, {
          autoClose: 8000
        });
      });

      socketInstance.on('checked_in', (data) => {
        if (user.role === 'student') {
          toast.success(`You have been checked in! Room: ${data.roomNumber}, Bed: ${data.bedNumber}`, {
            autoClose: 10000
          });
        }
      });

      socketInstance.on('checked_out', (data) => {
        if (user.role === 'student') {
          toast.info(`You have been checked out. Refund amount: ₹${data.refundAmount}`, {
            autoClose: 10000
          });
        }
      });

      socketInstance.on('hostel_approved', (data) => {
        if (user.role === 'hostel_owner') {
          toast.success(`Your hostel "${data.hostelName}" has been approved!`, {
            autoClose: 10000,
            onClick: () => {
              window.location.href = '/owner/hostels';
            }
          });
        }
      });

      socketInstance.on('hostel_rejected', (data) => {
        if (user.role === 'hostel_owner') {
          toast.error(`Your hostel "${data.hostelName}" has been rejected. Reason: ${data.reason}`, {
            autoClose: 15000,
            onClick: () => {
              window.location.href = '/owner/hostels';
            }
          });
        }
      });

      // Payment notifications
      socketInstance.on('payment_successful', (data) => {
        toast.success(`Payment of ₹${data.amount} successful for booking ${data.bookingId}`, {
          autoClose: 8000
        });
      });

      socketInstance.on('payment_failed', (data) => {
        toast.error(`Payment failed for booking ${data.bookingId}. Please try again.`, {
          autoClose: 10000
        });
      });

      // System notifications
      socketInstance.on('system_maintenance', (data) => {
        toast.warning(`System maintenance scheduled: ${data.message}`, {
          autoClose: 15000
        });
      });

      socketInstance.on('new_message', (data) => {
        toast.info(`New message from ${data.senderName}: ${data.preview}`, {
          autoClose: 6000,
          onClick: () => {
            // Navigate to messages page when implemented
            console.log('Navigate to messages');
          }
        });
      });

      setSocket(socketInstance);
    }

    // Cleanup function
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
        setConnected(false);
      }
    };
  }, [isAuthenticated, user, token]);

  // Emit functions
  const emitBookingRequest = (data) => {
    if (socket && connected) {
      socket.emit('booking_request', data);
    }
  };

  const emitBookingResponse = (data) => {
    if (socket && connected) {
      socket.emit('booking_response', data);
    }
  };

  const emitMessage = (data) => {
    if (socket && connected) {
      socket.emit('send_message', data);
    }
  };

  const joinRoom = (room) => {
    if (socket && connected) {
      socket.emit('join-room', room);
    }
  };

  const leaveRoom = (room) => {
    if (socket && connected) {
      socket.emit('leave-room', room);
    }
  };

  // Custom event listeners
  const addEventListener = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
      
      // Return cleanup function
      return () => {
        socket.off(event, callback);
      };
    }
    return () => {};
  };

  const removeEventListener = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  const value = {
    socket,
    connected,
    emitBookingRequest,
    emitBookingResponse,
    emitMessage,
    joinRoom,
    leaveRoom,
    addEventListener,
    removeEventListener
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};

export default SocketContext;