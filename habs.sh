#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

show_banner() {
    clear
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    HABS Control Panel                          ║${NC}"
    echo -e "${BLUE}║        Hostel Allotment & Booking System Manager               ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

show_menu() {
    echo -e "${CYAN}═══════════════════ Main Menu ═══════════════════${NC}"
    echo ""
    echo -e "  ${GREEN}1.${NC} 🚀 Start All (Backend + Frontend)"
    echo -e "  ${GREEN}2.${NC} 🛑 Stop All Servers"
    echo -e "  ${GREEN}3.${NC} 📊 Check Status"
    echo -e "  ${GREEN}4.${NC} 🔄 Restart All"
    echo -e "  ${GREEN}5.${NC} 📋 View Backend Logs"
    echo -e "  ${GREEN}6.${NC} 📋 View Frontend Logs"
    echo -e "  ${GREEN}7.${NC} 🌐 Open in Browser"
    echo -e "  ${GREEN}8.${NC} 🗑️  Clear Logs"
    echo -e "  ${GREEN}9.${NC} 📚 Show Documentation"
    echo -e "  ${RED}0.${NC} ❌ Exit"
    echo ""
    echo -e "${CYAN}═════════════════════════════════════════════════${NC}"
    echo ""
}

show_credentials() {
    echo ""
    echo -e "${YELLOW}🔐 Demo Credentials:${NC}"
    echo -e "   ${BLUE}Admin:${NC}    iamsatyampandey@gmail.com / admin@12345"
    echo -e "   ${BLUE}Owner:${NC}    rajesh.kumar@example.com / owner123"
    echo -e "   ${BLUE}Student:${NC}  rahul.singh@student.com / student123"
    echo ""
}

press_any_key() {
    echo ""
    echo -e "${YELLOW}Press any key to continue...${NC}"
    read -n 1 -s
}

start_all() {
    echo -e "${GREEN}Starting all servers...${NC}"
    echo ""
    ./start-all.sh
    press_any_key
}

stop_all() {
    echo -e "${RED}Stopping all servers...${NC}"
    echo ""
    ./stop-all.sh
    press_any_key
}

check_status() {
    ./status.sh
    show_credentials
    press_any_key
}

restart_all() {
    echo -e "${YELLOW}Restarting all servers...${NC}"
    echo ""
    ./stop-all.sh
    sleep 2
    ./start-all.sh
    press_any_key
}

view_backend_logs() {
    echo -e "${BLUE}Backend Logs (last 30 lines):${NC}"
    echo -e "${CYAN}═════════════════════════════════════════════════${NC}"
    if [ -f "logs/backend.log" ]; then
        tail -30 logs/backend.log
    else
        echo -e "${RED}No backend logs found${NC}"
    fi
    echo -e "${CYAN}═════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}To follow logs in real-time:${NC} tail -f logs/backend.log"
    press_any_key
}

view_frontend_logs() {
    echo -e "${BLUE}Frontend Logs (last 30 lines):${NC}"
    echo -e "${CYAN}═════════════════════════════════════════════════${NC}"
    if [ -f "logs/frontend.log" ]; then
        tail -30 logs/frontend.log
    else
        echo -e "${RED}No frontend logs found${NC}"
    fi
    echo -e "${CYAN}═════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}To follow logs in real-time:${NC} tail -f logs/frontend.log"
    press_any_key
}

open_browser() {
    echo -e "${GREEN}Opening application in browser...${NC}"
    echo ""
    
    # Check if frontend is running
    if lsof -ti :3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Opening http://localhost:3000${NC}"
        open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null
    elif lsof -ti :3001 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Opening http://localhost:3001${NC}"
        open http://localhost:3001 2>/dev/null || xdg-open http://localhost:3001 2>/dev/null
    else
        echo -e "${RED}❌ Frontend is not running${NC}"
        echo -e "${YELLOW}Start the servers first (Option 1)${NC}"
    fi
    
    show_credentials
    press_any_key
}

clear_logs() {
    echo -e "${YELLOW}⚠️  This will delete all log files${NC}"
    echo -e "${YELLOW}Are you sure? (y/N):${NC} "
    read -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f logs/*.log
        echo -e "${GREEN}✅ Logs cleared${NC}"
    else
        echo -e "${BLUE}Cancelled${NC}"
    fi
    press_any_key
}

show_docs() {
    echo -e "${BLUE}📚 Available Documentation:${NC}"
    echo ""
    echo -e "  ${GREEN}1.${NC} README.md                    - Main project documentation"
    echo -e "  ${GREEN}2.${NC} Documentation/COMPLETE.md    - Complete automation guide (START HERE!)"
    echo -e "  ${GREEN}3.${NC} Documentation/STARTUP_GUIDE.md    - Detailed startup instructions"
    echo -e "  ${GREEN}4.${NC} Documentation/QUICK_REFERENCE.md  - Quick command reference"
    echo -e "  ${GREEN}5.${NC} Documentation/AUTOMATION_SUMMARY.md - Automation details"
    echo -e "  ${GREEN}6.${NC} Documentation/TESTING_GUIDE.md    - Testing instructions"
    echo ""
    echo -e "${YELLOW}Enter number to view (or press Enter to go back):${NC} "
    read -r choice
    
    case $choice in
        1) cat README.md 2>/dev/null | less ;;
        2) cat Documentation/COMPLETE.md 2>/dev/null | less ;;
        3) cat Documentation/STARTUP_GUIDE.md 2>/dev/null | less ;;
        4) cat Documentation/QUICK_REFERENCE.md 2>/dev/null | less ;;
        5) cat Documentation/AUTOMATION_SUMMARY.md 2>/dev/null | less ;;
        6) cat Documentation/TESTING_GUIDE.md 2>/dev/null | less ;;
        *) ;;
    esac
}

# Main loop
while true; do
    show_banner
    show_menu
    
    echo -n "Select an option: "
    read -r choice
    echo ""
    
    case $choice in
        1) start_all ;;
        2) stop_all ;;
        3) check_status ;;
        4) restart_all ;;
        5) view_backend_logs ;;
        6) view_frontend_logs ;;
        7) open_browser ;;
        8) clear_logs ;;
        9) show_docs ;;
        0) 
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            sleep 2
            ;;
    esac
done
