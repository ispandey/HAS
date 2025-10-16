# 🎯 HABS Quick Reference

## 🚀 Start & Stop Commands

| Command | Description |
|---------|-------------|
| `./start-all.sh` | 🚀 Start both backend and frontend with auto port cleanup |
| `./stop-all.sh` | 🛑 Stop all running servers |
| `./status.sh` | 📊 Check if servers are running and their status |
| `cd backend && ./start.sh` | Start backend only (auto cleanup port 5001) |
| `cd frontend && ./start.sh` | Start frontend only (auto cleanup ports 3000/3001) |

## 📦 NPM Scripts

### Backend
```bash
cd backend
npm start              # Start production server
npm run dev            # Start with nodemon (auto-reload)
npm run start:clean    # Start with automatic port cleanup
npm run seed           # Populate database with sample data
```

### Frontend
```bash
cd frontend
npm start              # Start development server
npm run start:clean    # Start with automatic port cleanup
npm run build          # Create production build
npm test               # Run tests
```

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | iamsatyampandey@gmail.com | admin@12345 |
| 🏢 **Owner** | rajesh.kumar@example.com | owner123 |
| 🎓 **Student** | rahul.singh@student.com | student123 |

## 🌐 Application URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| API Health | http://localhost:5001/api/health |

## 📋 Logs Location

| Log File | Path |
|----------|------|
| Backend | `logs/backend.log` |
| Frontend | `logs/frontend.log` |

**View logs in real-time:**
```bash
tail -f logs/backend.log    # Backend logs
tail -f logs/frontend.log   # Frontend logs
```

## 🔧 Troubleshooting

### Port Already in Use
The scripts handle this automatically! Just run `./start-all.sh`

### Manual Port Cleanup
```bash
# Kill specific ports
lsof -ti :5001 | xargs kill -9   # Backend
lsof -ti :3000 | xargs kill -9   # Frontend
lsof -ti :3001 | xargs kill -9   # Frontend Alt

# Or use stop script
./stop-all.sh
```

### Check Server Status
```bash
./status.sh
```

### Reset Everything
```bash
./stop-all.sh          # Stop all servers
rm -rf logs/*.log      # Clear logs (optional)
./start-all.sh         # Fresh start
```

## 🗂️ Project Structure

```
HAS/
├── start-all.sh          # 🚀 Start everything
├── stop-all.sh           # 🛑 Stop everything
├── status.sh             # 📊 Check status
├── logs/
│   ├── backend.log       # Backend output
│   └── frontend.log      # Frontend output
├── backend/
│   ├── start.sh          # Start backend only
│   ├── server.js         # Express server
│   └── scripts/
│       └── seedData.js   # Database seeder
└── frontend/
    ├── start.sh          # Start frontend only
    ├── src/              # React source code
    └── public/           # Static assets
```

## 💡 Development Workflow

### Day Start
```bash
./start-all.sh     # Starts everything with one command
```

### Check if Running
```bash
./status.sh        # View server status and logs
```

### Make Changes
- Code auto-reloads (nodemon for backend, react-scripts for frontend)
- Check logs for errors: `tail -f logs/backend.log`

### Day End
```bash
./stop-all.sh      # Clean shutdown
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Run `./start-all.sh` (auto-cleanup) |
| Server not starting | Check logs in `logs/` directory |
| Can't connect to DB | Verify `.env` MongoDB connection string |
| Frontend won't compile | Run `npm install --legacy-peer-deps` |
| Backend not responding | Check `logs/backend.log` for errors |

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Main project documentation |
| [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) | Detailed startup guide |
| [TESTING_GUIDE.md](./TESTING_GUIDE.md) | Testing instructions |

## 🎨 Features by Dashboard

### Admin Dashboard
- View all users, hostels, bookings
- Approve/reject hostel listings
- Platform analytics and statistics
- User management (view, edit, delete)

### Owner Dashboard
- Manage hostel listings
- View bookings and revenue
- Add/edit hostel details
- Track occupancy rates

### Student Dashboard
- Browse available hostels
- Search and filter hostels
- Save favorite hostels
- View booking history
- Book hostel rooms

## ⌨️ Keyboard Shortcuts (in scripts)

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Stop running script |
| `Ctrl+Z` | Suspend process |

## 🔗 Quick Links

- **GitHub**: [Repository URL]
- **Issues**: [Issues URL]
- **Documentation**: [Docs URL]

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Maintainer**: HABS Development Team
