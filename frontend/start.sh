#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Checking for processes on ports 3000 and 3001...${NC}"

# Kill any process using port 3000
PORT_PID_3000=$(lsof -ti :3000)
if [ ! -z "$PORT_PID_3000" ]; then
    echo -e "${YELLOW}⚠️  Found process $PORT_PID_3000 on port 3000. Killing it...${NC}"
    kill -9 $PORT_PID_3000 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✅ Port 3000 is now free${NC}"
else
    echo -e "${GREEN}✅ Port 3000 is already free${NC}"
fi

# Kill any process using port 3001
PORT_PID_3001=$(lsof -ti :3001)
if [ ! -z "$PORT_PID_3001" ]; then
    echo -e "${YELLOW}⚠️  Found process $PORT_PID_3001 on port 3001. Killing it...${NC}"
    kill -9 $PORT_PID_3001 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✅ Port 3001 is now free${NC}"
else
    echo -e "${GREEN}✅ Port 3001 is already free${NC}"
fi

# Kill any react-scripts processes
echo -e "${YELLOW}🔍 Checking for running react-scripts processes...${NC}"
pkill -f "react-scripts" 2>/dev/null || true
sleep 1

echo -e "${GREEN}🚀 Starting frontend server...${NC}"
npm start
