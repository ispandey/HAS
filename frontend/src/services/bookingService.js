import API from './api';

const bookingService = {
  // Create new booking request
  createBooking: async (bookingData) => {
    return await API.post('/bookings', bookingData);
  },

  // Get user's bookings
  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/bookings/my-bookings?${queryString}`);
  },

  // Get booking by ID
  getBookingById: async (id) => {
    return await API.get(`/bookings/${id}`);
  },

  // Hostel owner respond to booking
  respondToBooking: async (id, response) => {
    return await API.put(`/bookings/${id}/respond`, response);
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    return await API.put(`/bookings/${id}/cancel`, { reason });
  },

  // Check-in student
  checkInStudent: async (id, checkInData) => {
    return await API.put(`/bookings/${id}/checkin`, checkInData);
  },

  // Check-out student
  checkOutStudent: async (id, checkOutData) => {
    return await API.put(`/bookings/${id}/checkout`, checkOutData);
  },

  // Submit review
  submitReview: async (id, reviewData) => {
    return await API.post(`/bookings/${id}/review`, reviewData);
  },

  // Get booking statistics for owner/admin
  getBookingStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/bookings/stats?${queryString}`);
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentData) => {
    return await API.put(`/bookings/${id}/payment`, paymentData);
  },

  // Get pending bookings (for owners)
  getPendingBookings: async (params = {}) => {
    const queryString = new URLSearchParams({ status: 'pending', ...params }).toString();
    return await API.get(`/bookings/my-bookings?${queryString}`);
  },

  // Get active bookings
  getActiveBookings: async (params = {}) => {
    const statuses = ['approved', 'checked_in'];
    const promises = statuses.map(status => 
      API.get(`/bookings/my-bookings?status=${status}&${new URLSearchParams(params).toString()}`)
    );
    
    const results = await Promise.all(promises);
    
    // Combine results
    const allBookings = results.reduce((acc, result) => {
      return [...acc, ...result.bookings];
    }, []);
    
    return { bookings: allBookings };
  }
};

export default bookingService;