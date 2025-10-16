#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Checking for processes on port 5001...${NC}"

# Kill any process using port 5001
PORT_PID=$(lsof -ti :5001)
if [ ! -z "$PORT_PID" ]; then
    echo -e "${YELLOW}⚠️  Found process $PORT_PID on port 5001. Killing it...${NC}"
    kill -9 $PORT_PID 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✅ Port 5001 is now free${NC}"
else
    echo -e "${GREEN}✅ Port 5001 is already free${NC}"
fi

# Kill any node processes running server.js
echo -e "${YELLOW}🔍 Checking for running server.js processes...${NC}"
pkill -f "node server.js" 2>/dev/null || true
sleep 1

echo -e "${GREEN}🚀 Starting backend server...${NC}"
npm start
