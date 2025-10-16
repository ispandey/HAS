#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Stopping HABS Application                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to kill processes on a port
kill_port() {
    PORT=$1
    PORT_NAME=$2
    PORT_PID=$(lsof -ti :$PORT)
    if [ ! -z "$PORT_PID" ]; then
        echo -e "${YELLOW}🛑 Stopping $PORT_NAME on port $PORT (PID: $PORT_PID)...${NC}"
        kill -9 $PORT_PID 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}✅ $PORT_NAME stopped${NC}"
    else
        echo -e "${GREEN}✅ No process running on port $PORT${NC}"
    fi
}

# Stop all servers
kill_port 5001 "Backend"
kill_port 3000 "Frontend"
kill_port 3001 "Frontend Alt"

# Kill any lingering processes
echo ""
echo -e "${YELLOW}🧹 Cleaning up lingering processes...${NC}"
pkill -f "node server.js" 2>/dev/null && echo -e "${GREEN}✅ Stopped node server.js${NC}" || true
pkill -f "react-scripts" 2>/dev/null && echo -e "${GREEN}✅ Stopped react-scripts${NC}" || true

echo ""
echo -e "${GREEN}✅ All HABS servers stopped successfully!${NC}"
echo ""
