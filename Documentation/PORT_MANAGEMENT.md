# 🔌 Frontend Port Management Explained

## ❓ The Question

**Why does the frontend use both port 3000 and 3001?**  
**Why does the terminal display 3000 but the app runs on 3001?**

---

## 📖 Understanding React's Port Behavior

### **How Create-React-App Works**

When you run `npm start` in a React app (create-react-app):

1. **First attempt**: React tries to start on **port 3000** (default)
2. **If 3000 is busy**: React automatically tries **port 3001**
3. **If 3001 is busy**: React tries 3002, 3003, and so on...

This is **built into `react-scripts`** and happens automatically.

---

## 🎯 What Was Happening

### **The Problem**

Your scripts were **hardcoded** to always display port 3000:

```bash
# Old code (incorrect)
echo "Frontend: http://localhost:3000"
```

But React might actually be running on **port 3001**!

### **Why Port 3000 Was Busy**

Possible reasons:
- Previous React app still running
- Another process using port 3000
- Previous session didn't close properly
- Multiple `npm start` commands

---

## ✅ The Solution (Now Fixed!)

### **What I Changed**

Updated **3 scripts** to **auto-detect** the actual port:

#### **1. start-all.sh** ✅
```bash
# NEW: Detect which port is actually being used
FRONTEND_PORT=""
if lsof -ti :3000 > /dev/null 2>&1; then
    FRONTEND_PORT="3000"
elif lsof -ti :3001 > /dev/null 2>&1; then
    FRONTEND_PORT="3001"
fi

# Display the ACTUAL port
echo "Frontend: http://localhost:${FRONTEND_PORT}"
```

#### **2. status.sh** ✅
```bash
# Detect actual frontend port
if lsof -ti :3000 > /dev/null 2>&1; then
    FRONTEND_PORT="3000"
elif lsof -ti :3001 > /dev/null 2>&1; then
    FRONTEND_PORT="3001"
fi

# Show correct URL
echo "Frontend: http://localhost:${FRONTEND_PORT}"
```

#### **3. habs.sh** ✅
Already had smart detection - opens correct port automatically!

---

## 🔍 How Port Detection Works

### **Using `lsof` (List Open Files)**

```bash
lsof -ti :3000
```

**What it does:**
- Lists processes using port 3000
- `-t` = show only process ID
- `-i :3000` = check internet connections on port 3000

**Returns:**
- Process ID if port is in use
- Nothing if port is free

---

## 🎯 Why Both Ports in Cleanup?

Our scripts clean up **both ports** to ensure a fresh start:

```bash
# Kill processes on BOTH ports
kill_port 3000 "Frontend"
kill_port 3001 "Frontend Alt"
```

**Reason:**
- If port 3000 is busy, React uses 3001
- Next time, you want port 3000 to be available
- So we clear BOTH to ensure consistent port usage

---

## 📊 Port Priority

React's preference order:

1. **Port 3000** ⭐ (First choice - default)
2. **Port 3001** (Automatic fallback)
3. **Port 3002** (If 3001 is busy)
4. **Port 3003** (And so on...)

**Goal:** Our scripts aim to keep frontend on **port 3000** consistently by cleaning it up first.

---

## 🛠️ Current Behavior (After Fix)

### **Scenario 1: Port 3000 is Free**
```bash
./start-all.sh
# Output:
✅ Port 3000 is already free
✅ Port 3001 is already free
🚀 Starting Frontend Server...
Frontend: http://localhost:3000 ✓ (Correct!)
```

### **Scenario 2: Port 3000 is Busy**
```bash
./start-all.sh
# Output:
⚠️  Found process on port 3000. Killing it...
✅ Port 3000 is now free
✅ Port 3001 is already free
🚀 Starting Frontend Server...
Frontend: http://localhost:3000 ✓ (Correct!)
```

### **Scenario 3: Something Blocks Cleanup**
```bash
./start-all.sh
# Output:
⚠️  Port 3000 couldn't be freed
✅ Port 3001 is free
🚀 Starting Frontend Server...
Frontend: http://localhost:3001 ✓ (Correctly detected!)
```

---

## 💡 Best Practices

### **Always Use Automation Scripts**

✅ **Recommended:**
```bash
./start-all.sh    # Handles cleanup automatically
./habs.sh         # Interactive menu
```

❌ **Avoid:**
```bash
npm start         # Might use wrong port
                  # No automatic cleanup
```

### **Check Actual Port**

Use the status checker:
```bash
./status.sh
# Shows ACTUAL port being used
```

### **Manual Port Check**

```bash
# Check what's on port 3000
lsof -i :3000

# Check what's on port 3001
lsof -i :3001
```

---

## 🔧 Troubleshooting

### **Problem: "Address already in use"**

**Solution:**
```bash
# Let scripts handle it
./stop-all.sh
./start-all.sh

# Or manual cleanup
lsof -ti :3000 | xargs kill -9
lsof -ti :3001 | xargs kill -9
```

### **Problem: Can't access frontend**

**Check actual port:**
```bash
./status.sh
# Look for the Frontend URL
```

**Or check browser console:**
```
Failed to load resource: http://localhost:3000/
```
Try: http://localhost:3001/ instead

### **Problem: Port keeps changing**

**Cause:** Something else is using port 3000

**Find the culprit:**
```bash
lsof -i :3000
# Shows what process is using it
```

**Kill it:**
```bash
kill -9 <PID>
```

---

## 📈 Port Usage Timeline

```
Time 0: Start scripts
├─ Kill port 3000 ✓
├─ Kill port 3001 ✓
└─ Port 3000 is FREE

Time 1: npm start
├─ Try port 3000 ✓
└─ SUCCESS: Running on 3000

Display: http://localhost:3000 ✓ CORRECT!
```

**But if cleanup fails:**

```
Time 0: Start scripts
├─ Try kill port 3000 ✗ (failed)
├─ Kill port 3001 ✓
└─ Port 3000 still BUSY

Time 1: npm start
├─ Try port 3000 ✗ (busy)
├─ Try port 3001 ✓
└─ SUCCESS: Running on 3001

Display: http://localhost:3001 ✓ NOW CORRECT! (after fix)
```

---

## 🎯 Summary

### **What Changed**

| Script | Before | After |
|--------|--------|-------|
| **start-all.sh** | Always showed 3000 | Detects actual port |
| **status.sh** | Showed 3000 | Detects actual port |
| **habs.sh** | Already correct | No change needed |

### **Key Improvements**

✅ **Accurate display** - Shows the port frontend actually uses  
✅ **Auto-detection** - Checks ports 3000 and 3001  
✅ **Smart browser opening** - Opens correct URL  
✅ **Better debugging** - Know exactly where frontend is running  

### **How It Works Now**

1. **Cleanup**: Scripts kill processes on both 3000 and 3001
2. **Start**: React starts (usually on 3000)
3. **Detect**: Scripts check which port is actually in use
4. **Display**: Shows correct URL (3000 or 3001)
5. **Open**: Browser opens correct port

---

## 🔗 Related Files

- **start-all.sh** - Main startup (now detects port)
- **status.sh** - Status checker (now detects port)
- **habs.sh** - Control panel (already correct)
- **frontend/start.sh** - Frontend only (cleans both ports)
- **stop-all.sh** - Stops both ports

---

## 💡 Pro Tips

1. **Always check status** after starting:
   ```bash
   ./status.sh
   ```

2. **Use control panel** for easy access:
   ```bash
   ./habs.sh
   # Option 7 - Opens correct port automatically
   ```

3. **When in doubt**, stop and restart:
   ```bash
   ./stop-all.sh && ./start-all.sh
   ```

4. **Check logs** if port seems wrong:
   ```bash
   tail -f logs/frontend.log
   # Look for: "On Your Network: http://localhost:XXXX"
   ```

---

**The scripts now intelligently detect and display the correct frontend port!** 🎉
