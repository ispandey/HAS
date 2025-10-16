#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        HABS - Hostel Allotment & Booking System               ║${NC}"
echo -e "${BLUE}║              Starting Full Stack Application                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to kill processes on a port
kill_port() {
    PORT=$1
    PORT_NAME=$2
    PORT_PID=$(lsof -ti :$PORT)
    if [ ! -z "$PORT_PID" ]; then
        echo -e "${YELLOW}⚠️  Found process $PORT_PID on port $PORT ($PORT_NAME). Killing it...${NC}"
        kill -9 $PORT_PID 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✅ Port $PORT is now free${NC}"
    else
        echo -e "${GREEN}✅ Port $PORT is already free${NC}"
    fi
}

# Clean up all ports
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
echo ""

kill_port 5001 "Backend"
kill_port 3000 "Frontend"
kill_port 3001 "Frontend Alt"

# Kill any lingering processes
echo -e "${YELLOW}🔍 Checking for lingering node processes...${NC}"
pkill -f "node server.js" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
sleep 2

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Start backend
echo -e "${GREEN}🚀 Starting Backend Server on port 5001...${NC}"
cd backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"
cd ..

# Wait for backend to initialize
echo -e "${YELLOW}⏳ Waiting for backend to initialize...${NC}"
sleep 5

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend is running successfully${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check logs/backend.log${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Start frontend
echo -e "${GREEN}🚀 Starting Frontend Server on port 3000/3001...${NC}"
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"
cd ..

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🎉 HABS Application Started Successfully!${NC}"
echo ""

# Wait a moment for frontend to bind to a port
sleep 3

# Detect which port frontend is actually using
FRONTEND_PORT=""
if lsof -ti :3000 > /dev/null 2>&1; then
    FRONTEND_PORT="3000"
elif lsof -ti :3001 > /dev/null 2>&1; then
    FRONTEND_PORT="3001"
else
    FRONTEND_PORT="3000 (starting...)"
fi

# Get network IP address
NETWORK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo -e "${YELLOW}📊 Server Information:${NC}"
echo ""
echo -e "${BLUE}Backend API:${NC}"
echo -e "   Local:   ${GREEN}http://localhost:5001${NC} (PID: $BACKEND_PID)"
if [ ! -z "$NETWORK_IP" ]; then
    echo -e "   Network: ${GREEN}http://${NETWORK_IP}:5001${NC}"
fi
echo ""
echo -e "${BLUE}Frontend App:${NC}"
echo -e "   Local:   ${GREEN}http://localhost:${FRONTEND_PORT}${NC} (PID: $FRONTEND_PID)"
if [ ! -z "$NETWORK_IP" ]; then
    echo -e "   Network: ${GREEN}http://${NETWORK_IP}:${FRONTEND_PORT}${NC} 🌐"
fi
echo ""
if [ ! -z "$NETWORK_IP" ]; then
    echo -e "${YELLOW}📱 Access from other devices (same WiFi):${NC}"
    echo -e "   Open browser and go to: ${BLUE}http://${NETWORK_IP}:${FRONTEND_PORT}${NC}"
fi
echo ""
echo -e "${YELLOW}📝 Demo Login Credentials:${NC}"
echo -e "   ${BLUE}Admin:${NC}    iamsatyampandey@gmail.com / admin@12345"
echo -e "   ${BLUE}Owner:${NC}    rajesh.kumar@example.com / owner123"
echo -e "   ${BLUE}Student:${NC}  rahul.singh@student.com / student123"
echo ""
echo -e "${YELLOW}📋 Logs:${NC}"
echo -e "   Backend:  logs/backend.log"
echo -e "   Frontend: logs/frontend.log"
echo ""
echo -e "${YELLOW}🛑 To stop all servers, run:${NC}"
echo -e "   ./stop-all.sh"
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Opening browser in 5 seconds...${NC}"
sleep 5

# Open browser with the correct port (macOS)
if command -v open &> /dev/null; then
    if [ "$FRONTEND_PORT" = "3000" ]; then
        open http://localhost:3000 2>/dev/null
    elif [ "$FRONTEND_PORT" = "3001" ]; then
        open http://localhost:3001 2>/dev/null
    else
        # Fallback: try both
        open http://localhost:3000 2>/dev/null || open http://localhost:3001 2>/dev/null
    fi
fi
