#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              HABS - Application Status Check                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if a port is in use
check_port() {
    PORT=$1
    NAME=$2
    PORT_PID=$(lsof -ti :$PORT)
    
    if [ ! -z "$PORT_PID" ]; then
        echo -e "${GREEN}✅ $NAME is running${NC}"
        echo -e "   Port: $PORT | PID: $PORT_PID"
        
        # Try to get process info
        PROCESS_INFO=$(ps -p $PORT_PID -o command= 2>/dev/null)
        if [ ! -z "$PROCESS_INFO" ]; then
            echo -e "   Process: ${BLUE}$PROCESS_INFO${NC}"
        fi
        
        # Check if it's responding
        if [ "$NAME" == "Backend" ]; then
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/api/health 2>/dev/null)
            if [ "$HTTP_CODE" == "200" ]; then
                echo -e "   Status: ${GREEN}Healthy ✓${NC}"
            else
                echo -e "   Status: ${YELLOW}Running but not responding${NC}"
            fi
        elif [ "$NAME" == "Frontend" ]; then
            HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null)
            if [ "$HTTP_CODE" == "200" ]; then
                echo -e "   Status: ${GREEN}Accessible ✓${NC}"
            else
                echo -e "   Status: ${YELLOW}Port open but not responding${NC}"
            fi
        fi
        echo ""
        return 0
    else
        echo -e "${RED}❌ $NAME is not running${NC}"
        echo -e "   Port: $PORT | Status: Free"
        echo ""
        return 1
    fi
}

# Check all services
echo -e "${YELLOW}📊 Checking Application Services...${NC}"
echo ""

BACKEND_STATUS=0
FRONTEND_STATUS=0

check_port 5001 "Backend" && BACKEND_STATUS=1
check_port 3000 "Frontend" && FRONTEND_STATUS=1 || check_port 3001 "Frontend (Alt)" && FRONTEND_STATUS=1

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Detect actual frontend port
FRONTEND_PORT=""
if lsof -ti :3000 > /dev/null 2>&1; then
    FRONTEND_PORT="3000"
elif lsof -ti :3001 > /dev/null 2>&1; then
    FRONTEND_PORT="3001"
fi

# Get network IP address
NETWORK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

# Overall status
if [ $BACKEND_STATUS -eq 1 ] && [ $FRONTEND_STATUS -eq 1 ]; then
    echo -e "${GREEN}✅ All Services Running${NC}"
    echo ""
    echo -e "${YELLOW}🌐 Access Application:${NC}"
    echo ""
    echo -e "${BLUE}Frontend:${NC}"
    if [ ! -z "$FRONTEND_PORT" ]; then
        echo -e "   Local:   ${GREEN}http://localhost:${FRONTEND_PORT}${NC}"
        if [ ! -z "$NETWORK_IP" ]; then
            echo -e "   Network: ${GREEN}http://${NETWORK_IP}:${FRONTEND_PORT}${NC} 🌐"
        fi
    else
        echo -e "   Local:   ${GREEN}http://localhost:3000${NC} ${YELLOW}(check actual port)${NC}"
    fi
    echo ""
    echo -e "${BLUE}Backend:${NC}"
    echo -e "   Local:   ${GREEN}http://localhost:5001${NC}"
    if [ ! -z "$NETWORK_IP" ]; then
        echo -e "   Network: ${GREEN}http://${NETWORK_IP}:5001${NC}"
    fi
    echo ""
    if [ ! -z "$NETWORK_IP" ]; then
        echo -e "${YELLOW}📱 Access from other devices (same WiFi):${NC}"
        echo -e "   ${BLUE}http://${NETWORK_IP}:${FRONTEND_PORT}${NC}"
        echo ""
    fi
    echo ""
    echo -e "${YELLOW}📝 Demo Credentials:${NC}"
    echo -e "   Admin:   iamsatyampandey@gmail.com / admin@12345"
    echo -e "   Owner:   rajesh.kumar@example.com / owner123"
    echo -e "   Student: rahul.singh@student.com / student123"
elif [ $BACKEND_STATUS -eq 1 ] || [ $FRONTEND_STATUS -eq 1 ]; then
    echo -e "${YELLOW}⚠️  Partial Service Availability${NC}"
    [ $BACKEND_STATUS -eq 0 ] && echo -e "   ${RED}Backend is not running${NC}"
    [ $FRONTEND_STATUS -eq 0 ] && echo -e "   ${RED}Frontend is not running${NC}"
    echo ""
    echo -e "${YELLOW}💡 To start all services:${NC} ./start-all.sh"
else
    echo -e "${RED}❌ No Services Running${NC}"
    echo ""
    echo -e "${YELLOW}💡 To start the application:${NC} ./start-all.sh"
fi

echo ""
echo -e "${YELLOW}📋 Recent Logs:${NC}"

if [ -f "logs/backend.log" ]; then
    echo ""
    echo -e "${BLUE}Backend (last 5 lines):${NC}"
    tail -5 logs/backend.log 2>/dev/null || echo "No backend logs found"
fi

if [ -f "logs/frontend.log" ]; then
    echo ""
    echo -e "${BLUE}Frontend (last 5 lines):${NC}"
    tail -5 logs/frontend.log 2>/dev/null | grep -v "^$" | head -5 || echo "No frontend logs found"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Exit code based on overall status
if [ $BACKEND_STATUS -eq 1 ] && [ $FRONTEND_STATUS -eq 1 ]; then
    exit 0
else
    exit 1
fi
