# VidFlow Quick Start Guide

Get VidFlow up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm 9+ (`npm --version`)
- ✅ Docker Desktop (recommended) or MongoDB + Redis installed

## 🚀 Fastest Way to Start (Docker)

```bash
# 1. Clone and enter directory
git clone <repository-url>
cd vidflow

# 2. Copy environment files
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env

# 3. Start everything with Docker
docker-compose up
```

**That's it!** 🎉

Open your browser to: **http://localhost:5173**

The services will be running at:
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **API**: http://localhost:3001
- 🗄️ **MongoDB**: localhost:27017
- 📦 **Redis**: localhost:6379

## 🎯 Your First Steps

### 1. Create an Account

1. Open http://localhost:5173
2. Click **"Sign up"**
3. Enter your details:
   - Name: `Your Name`
   - Email: `your@email.com`
   - Password: `password123` (min 8 characters)
4. Click **"Sign up"**

You'll be automatically logged in!

### 2. Create a Project

1. On the dashboard, click **"New Project"**
2. Enter a project name: `My First Video`
3. Click **"Create"**

You'll be taken to the editor!

### 3. Explore the Editor

The editor has three main areas:
- **Left Sidebar**: Node palette (drag nodes from here)
- **Center**: Canvas area (your video timeline)
- **Right Sidebar**: Properties panel (node settings)

> **Note**: The node editor is coming in Phase 5. For now, you can explore the dashboard and project management.

## 🛠️ Alternative: Manual Setup

If you prefer not to use Docker:

### 1. Install Dependencies

```bash
npm install
npm run bootstrap
```

### 2. Start MongoDB and Redis

**macOS** (with Homebrew):
```bash
brew services start mongodb-community
brew services start redis
```

**Linux** (with systemd):
```bash
sudo systemctl start mongod
sudo systemctl start redis
```

**Windows**: Use MongoDB Community Server and Redis for Windows

### 3. Setup Environment

```bash
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env
```

### 4. Start Development Servers

**Option A**: Use Makefile (if you have Make)
```bash
make dev
```

**Option B**: Manual start (3 terminals)

Terminal 1 - Shared package:
```bash
cd packages/shared && npm run dev
```

Terminal 2 - Server:
```bash
cd packages/server && npm run dev
```

Terminal 3 - Client:
```bash
cd packages/client && npm run dev
```

**Option C**: Use root command (parallel)
```bash
npm run dev
```

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-30T..."
}
```

### Register a User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response!

### Create a Project
```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Test Project",
    "description": "My first project"
  }'
```

## 🐛 Common Issues

### Port Already in Use

**Problem**: "Port 3001 is already in use"

**Solution**:
```bash
# Find and kill the process
lsof -i :3001
kill -9 <PID>

# Or use a different port
# Edit packages/server/.env: PORT=3002
```

### Cannot Connect to MongoDB

**Problem**: "MongoNetworkError: failed to connect"

**Solution**:
```bash
# Check if MongoDB is running
pgrep mongo

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Cannot Connect to Redis

**Problem**: "Error: Redis connection failed"

**Solution**:
```bash
# Check if Redis is running
redis-cli ping  # Should return "PONG"

# Start Redis
brew services start redis      # macOS
sudo systemctl start redis     # Linux
```

### TypeScript Errors

**Problem**: "Cannot find module '@vidflow/shared'"

**Solution**:
```bash
# Rebuild the shared package
cd packages/shared
npm run build
cd ../..

# Reinstall if needed
npm run clean
npm install
npm run bootstrap
```

### Docker Issues

**Problem**: Docker containers won't start

**Solution**:
```bash
# Stop everything
docker-compose down

# Remove old volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

### CORS Errors

**Problem**: "CORS policy blocked"

**Solution**:
Check that `CORS_ORIGIN` in `packages/server/.env` matches your client URL:
```env
CORS_ORIGIN=http://localhost:5173
```

Restart the server after changing `.env` files!

## 📚 Next Steps

Once you have everything running:

1. **Read the docs**: Check out [README.md](README.md) for full documentation
2. **Explore the code**: Start with `packages/client/src/App.tsx` and `packages/server/src/index.ts`
3. **Make changes**: The dev server has hot-reload enabled
4. **Read architecture**: Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
5. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

## 🎓 Learning Resources

### Project Structure
- `packages/client/` - React frontend
- `packages/server/` - Express backend
- `packages/shared/` - Shared TypeScript types

### Key Files to Explore
- **Frontend**: `packages/client/src/App.tsx` - Main app
- **Backend**: `packages/server/src/index.ts` - Server entry
- **Types**: `packages/shared/src/types/` - All TypeScript types
- **API**: `packages/server/src/routes/` - All API routes

### Useful Commands

```bash
# Lint all code
make lint

# Build all packages
make build

# Clean everything
make clean

# Check status
make status

# View Docker logs
make docker-logs
```

## 💡 Tips

1. **Enable auto-save** in your editor for the best hot-reload experience
2. **Use the React DevTools** browser extension for debugging
3. **Check the browser console** for client-side errors
4. **Check the terminal** for server-side errors
5. **Use Postman or Thunder Client** for testing APIs

## 🆘 Getting Help

- **Documentation**: Start with README.md
- **Setup Issues**: Check SETUP.md
- **Architecture Questions**: Read ARCHITECTURE.md
- **Contributing**: See CONTRIBUTING.md
- **Status**: View STATUS.md for current progress

## ✅ Checklist

Before you start developing, make sure:

- [ ] All services are running (use `make status`)
- [ ] You can access http://localhost:5173
- [ ] You can create an account
- [ ] You can create a project
- [ ] You can see the editor page
- [ ] API health check returns "ok"
- [ ] You've read the README.md

**You're all set!** Happy coding! 🚀

---

**Pro tip**: Keep this guide open in another tab as a reference while you develop!
