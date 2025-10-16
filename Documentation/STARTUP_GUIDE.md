# 🚀 HABS Startup Scripts

Automated scripts to start and stop the HABS (Hostel Allotment & Booking System) application with automatic port cleanup.

## 📋 Available Scripts

### 1. **Start Full Stack Application** (Recommended)
```bash
./start-all.sh
```
**What it does:**
- ✅ Kills any processes running on ports 5001, 3000, and 3001
- ✅ Cleans up lingering node and react-scripts processes
- ✅ Starts backend server on port 5001
- ✅ Waits for backend to initialize
- ✅ Starts frontend server on port 3000
- ✅ Displays server information and demo credentials
- ✅ Opens browser automatically after 5 seconds
- ✅ Saves logs to `logs/backend.log` and `logs/frontend.log`

### 2. **Stop All Servers**
```bash
./stop-all.sh
```
**What it does:**
- 🛑 Stops all backend and frontend processes
- 🧹 Cleans up all lingering node processes
- ✅ Frees ports 5001, 3000, and 3001

### 3. **Start Backend Only**
```bash
cd backend
./start.sh
```
or
```bash
cd backend
npm run start:clean
```
**What it does:**
- ✅ Kills any process on port 5001
- ✅ Starts backend server with automatic port cleanup

### 4. **Start Frontend Only**
```bash
cd frontend
./start.sh
```
or
```bash
cd frontend
npm run start:clean
```
**What it does:**
- ✅ Kills any processes on ports 3000 and 3001
- ✅ Starts frontend server with automatic port cleanup

## 🎯 Quick Start Guide

### First Time Setup
1. Make sure you have MongoDB connection configured in `backend/.env`
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Run the Application
```bash
# From the project root directory
./start-all.sh
```

That's it! The script handles everything automatically.

## 📊 What You'll See

When you run `./start-all.sh`, you'll see output like:

```
╔════════════════════════════════════════════════════════════════╗
║        HABS - Hostel Allotment & Booking System               ║
║              Starting Full Stack Application                   ║
╚════════════════════════════════════════════════════════════════╝

🧹 Cleaning up existing processes...

✅ Port 5001 is already free
✅ Port 3000 is already free
✅ Port 3001 is already free

🚀 Starting Backend Server on port 5001...
✅ Backend started with PID: 12345
⏳ Waiting for backend to initialize...
✅ Backend is running successfully

🚀 Starting Frontend Server on port 3000/3001...
✅ Frontend started with PID: 12346

🎉 HABS Application Started Successfully!

📊 Server Information:
   Backend:  http://localhost:5001 (PID: 12345)
   Frontend: http://localhost:3000 (PID: 12346)

📝 Demo Login Credentials:
   Admin:    iamsatyampandey@gmail.com / admin@12345
   Owner:    rajesh.kumar@example.com / owner123
   Student:  rahul.singh@student.com / student123

📋 Logs:
   Backend:  logs/backend.log
   Frontend: logs/frontend.log

🛑 To stop all servers, run:
   ./stop-all.sh
```

## 🔧 Troubleshooting

### Port Already in Use
The scripts automatically handle this! They kill any existing processes before starting.

### Scripts Not Executable
If you get "Permission denied", run:
```bash
chmod +x start-all.sh stop-all.sh backend/start.sh frontend/start.sh
```

### Check Logs
If servers don't start properly:
```bash
# Check backend logs
tail -f logs/backend.log

# Check frontend logs
tail -f logs/frontend.log
```

### Manual Cleanup
If something goes wrong, you can manually clean up:
```bash
# Kill backend
lsof -ti :5001 | xargs kill -9

# Kill frontend
lsof -ti :3000 | xargs kill -9
lsof -ti :3001 | xargs kill -9

# Kill all node processes (use with caution!)
pkill -f "node server.js"
pkill -f "react-scripts"
```

## 📝 Script Features

### Automatic Port Cleanup
- **Before starting**: Kills any process using required ports
- **Handles multiple ports**: Checks 5001, 3000, and 3001
- **Safe execution**: Uses proper error handling

### Process Management
- **Backend**: Runs as background process
- **Frontend**: Runs as background process
- **Logging**: Captures all output to log files
- **Status checking**: Verifies servers started successfully

### User Experience
- **Color-coded output**: Easy to read status messages
- **Progress indicators**: Shows what's happening
- **Auto-browser**: Opens app automatically
- **Demo credentials**: Displays test accounts

## 🎨 Color Code

- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warning or informational messages
- 🔴 **Red**: Error messages
- 🔵 **Blue**: Section headers

## 📂 File Structure

```
HAS/
├── start-all.sh          # Start both servers
├── stop-all.sh           # Stop all servers
├── logs/
│   ├── backend.log       # Backend server logs
│   ├── frontend.log      # Frontend server logs
│   └── README.md
├── backend/
│   ├── start.sh          # Start backend only
│   └── package.json      # npm run start:clean
└── frontend/
    ├── start.sh          # Start frontend only
    └── package.json      # npm run start:clean
```

## 🚦 Port Configuration

- **Backend API**: Port 5001
- **Frontend Dev Server**: Port 3000 (or 3001 if 3000 is busy)
- **MongoDB**: Port 27017 (Atlas cloud or local)

## 💡 Pro Tips

1. **Always use `./start-all.sh`** for development - it ensures clean startup
2. **Use `./stop-all.sh`** before closing your terminal - prevents orphaned processes
3. **Check logs** if something doesn't work - they contain detailed error messages
4. **Keep terminals separate** if you need to see real-time logs:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm start
   ```

## 🔄 Development Workflow

```bash
# Day 1: Start working
./start-all.sh

# Make changes to code...
# Servers auto-reload with nodemon (backend) and react-scripts (frontend)

# End of day: Stop servers
./stop-all.sh
```

## 📞 Support

If you encounter issues:
1. Check `logs/backend.log` and `logs/frontend.log`
2. Ensure MongoDB connection string is correct in `backend/.env`
3. Verify all dependencies are installed: `npm install`
4. Try manual cleanup and restart

## ✅ Checklist Before Starting

- [ ] MongoDB connection configured in `backend/.env`
- [ ] Dependencies installed (`npm install` in both folders)
- [ ] Ports 5001 and 3000 are available (scripts handle this)
- [ ] Node.js version 14+ installed

---

**Happy Coding! 🚀**
