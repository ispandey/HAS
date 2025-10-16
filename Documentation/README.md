# 📚 HABS Documentation

Welcome to the HABS (Hostel Allotment & Booking System) documentation center!

---

## 🚀 Quick Start

**New to the project?** Start here:

1. **[COMPLETE.md](./COMPLETE.md)** - 🎉 **START HERE!** Complete automation overview
2. **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** - Detailed startup instructions

---

## 📖 Available Documentation

### 🎯 For Getting Started

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[COMPLETE.md](./COMPLETE.md)** | Complete automation guide and quick start | First time setup |
| **[STARTUP_GUIDE.md](./STARTUP_GUIDE.md)** | Comprehensive startup instructions | Understanding automation |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Command cheat sheet | Daily development |

### 🔧 For Development

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md)** | Technical automation details | Understanding scripts |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | Dashboard testing instructions | Testing features |
| **[NETWORK_ACCESS.md](./NETWORK_ACCESS.md)** | Network URLs and device access | Testing on mobile/other devices |

### 📋 Meta Documentation

| Document | Description | When to Use |
|----------|-------------|-------------|
| **[ORGANIZATION_CHANGES.md](./ORGANIZATION_CHANGES.md)** | How documentation was organized | Understanding folder structure |

---

## 🎯 Common Tasks

### Starting the Application
```bash
# Interactive menu (easiest!)
./habs.sh

# Direct command
./start-all.sh
```
📖 Details: [STARTUP_GUIDE.md](./STARTUP_GUIDE.md)

### Checking Server Status
```bash
./status.sh
```
📖 Details: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Testing Features
```bash
# Login with demo accounts
# See credentials in TESTING_GUIDE.md
```
📖 Details: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | iamsatyampandey@gmail.com | admin@12345 |
| 🏢 **Owner** | rajesh.kumar@example.com | owner123 |
| 🎓 **Student** | rahul.singh@student.com | student123 |

---

## 🌐 Application URLs

### Local Access
- **Frontend**: http://localhost:3000 (or 3001)
- **Backend**: http://localhost:5001
- **API Health**: http://localhost:5001/api/health

### Network Access (Other Devices)
- **Frontend**: http://192.168.5.115:3000 (or 3001)
- **Backend**: http://192.168.5.115:5001

📖 **Full Guide**: [NETWORK_ACCESS.md](./NETWORK_ACCESS.md) - Learn how to access from mobile/tablet

---

## 📁 Documentation Structure

```
Documentation/
├── README.md                  # This file - Documentation index
├── COMPLETE.md                # Complete automation overview (START HERE!)
├── STARTUP_GUIDE.md           # Detailed startup guide
├── QUICK_REFERENCE.md         # Quick command reference
├── AUTOMATION_SUMMARY.md      # Technical implementation details
└── TESTING_GUIDE.md           # Testing instructions
```

---

## 🎓 Learning Path

### Day 1: Setup
1. Read [COMPLETE.md](./COMPLETE.md) - Overview of automation
2. Run `./habs.sh` - Start the application
3. Login with demo accounts - Explore dashboards

### Day 2: Development
1. Read [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) - Understand scripts
2. Bookmark [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Keep it handy
3. Use `./status.sh` regularly - Monitor your app

### Day 3: Testing
1. Read [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Test all features
2. Test each user role thoroughly
3. Report any issues found

### Ongoing
- Reference [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for commands
- Check [AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md) for technical details

---

## 🔍 Find What You Need

### I want to...

- **Start the app** → [STARTUP_GUIDE.md](./STARTUP_GUIDE.md) or run `./habs.sh`
- **Learn about automation** → [COMPLETE.md](./COMPLETE.md)
- **See all commands** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Test features** → [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Understand how scripts work** → [AUTOMATION_SUMMARY.md](./AUTOMATION_SUMMARY.md)
- **Troubleshoot issues** → [STARTUP_GUIDE.md](./STARTUP_GUIDE.md#troubleshooting)

---

## 💡 Tips

- **Keep QUICK_REFERENCE.md handy** - It's your daily companion
- **Use ./habs.sh** - Easiest way to manage the app
- **Check ./status.sh** - Quick health check anytime
- **Read logs** - `tail -f logs/*.log` for debugging

---

## 🆘 Need Help?

1. Check the relevant documentation above
2. Review logs: `tail -f logs/backend.log` or `logs/frontend.log`
3. Run `./status.sh` to check server status
4. Try `./stop-all.sh` then `./start-all.sh` for a fresh start

---

## 📊 Documentation Stats

- **Total Documents**: 5 comprehensive guides
- **Total Size**: ~40 KB of detailed documentation
- **Coverage**: Startup, automation, testing, commands, troubleshooting
- **Last Updated**: October 16, 2025

---

## 🎯 Quick Links

- [Main README](../README.md) - Project overview
- [Backend Scripts](../backend/) - Backend source code
- [Frontend Source](../frontend/) - Frontend source code
- [Automation Scripts](../) - Root level scripts (habs.sh, start-all.sh, etc.)

---

**Happy Reading! 📚**  
**Happy Coding! 💻**
