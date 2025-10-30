# VidFlow Setup Guide

This guide will help you set up VidFlow for development.

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# 1. Clone the repository
git clone <repository-url>
cd vidflow

# 2. Copy environment files
cp packages/server/.env.example packages/server/.env
cp packages/client/.env.example packages/client/.env

# 3. Start all services
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- MongoDB: localhost:27017
- Redis: localhost:6379

## Manual Setup

If you prefer not to use Docker:

### Prerequisites

Install the following on your system:
- Node.js 18+ and npm 9+
- MongoDB 7+
- Redis 7+

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Bootstrap all packages (installs dependencies for all workspaces)
npm run bootstrap
```

### Step 2: Configure Environment Variables

#### Server Configuration

Copy the example environment file:
```bash
cp packages/server/.env.example packages/server/.env
```

Edit `packages/server/.env`:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vidflow
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
ENCRYPTION_KEY=your-32-byte-encryption-key-here-change-this
CORS_ORIGIN=http://localhost:5173
```

**Important**: Change the JWT_SECRET, JWT_REFRESH_SECRET, and ENCRYPTION_KEY to secure random strings in production!

#### Client Configuration

Copy the example environment file:
```bash
cp packages/client/.env.example packages/client/.env
```

Edit `packages/client/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

### Step 3: Start MongoDB and Redis

Make sure MongoDB and Redis are running on your system.

**MongoDB**:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux with systemd
sudo systemctl start mongod

# Or run directly
mongod --dbpath /path/to/data
```

**Redis**:
```bash
# macOS with Homebrew
brew services start redis

# Linux with systemd
sudo systemctl start redis

# Or run directly
redis-server
```

### Step 4: Build Shared Package

The shared package contains TypeScript types used by both client and server:

```bash
cd packages/shared
npm run build
cd ../..
```

### Step 5: Start Development Servers

Open three terminal windows:

**Terminal 1 - Shared Package (watch mode)**:
```bash
cd packages/shared
npm run dev
```

**Terminal 2 - Server**:
```bash
cd packages/server
npm run dev
```

**Terminal 3 - Client**:
```bash
cd packages/client
npm run dev
```

Or use the root command to start all in parallel:
```bash
npm run dev
```

### Step 6: Access the Application

- Open your browser to http://localhost:5173
- The API is available at http://localhost:3001
- Health check: http://localhost:3001/health

## Creating Your First Account

1. Navigate to http://localhost:5173
2. Click "Sign up" to create an account
3. Fill in your name, email, and password (min 8 characters)
4. You'll be automatically logged in and redirected to the dashboard

## Development Workflow

### Making Changes

The development setup includes hot-reload:
- **Client**: Vite automatically reloads on changes
- **Server**: Nodemon restarts the server on changes
- **Shared**: TypeScript watch mode rebuilds on changes

### Database Access

**MongoDB**:
```bash
# Connect with mongosh
mongosh mongodb://localhost:27017/vidflow

# View users
db.users.find()

# View projects
db.projects.find()
```

**Redis**:
```bash
# Connect with redis-cli
redis-cli

# View all keys
KEYS *
```

### Linting

Run ESLint on all packages:
```bash
npm run lint
```

Or for individual packages:
```bash
cd packages/client && npm run lint
cd packages/server && npm run lint
```

### Building for Production

Build all packages:
```bash
npm run build
```

Or build individually:
```bash
cd packages/shared && npm run build
cd packages/server && npm run build
cd packages/client && npm run build
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 3001 (server)
lsof -i :3001
kill -9 <PID>

# Find process using port 5173 (client)
lsof -i :5173
kill -9 <PID>
```

### MongoDB Connection Issues

1. Ensure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   pgrep mongo
   
   # Or check with systemctl (Linux)
   systemctl status mongod
   ```

2. Check the connection string in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/vidflow
   ```

### Redis Connection Issues

1. Ensure Redis is running:
   ```bash
   # Check if Redis is running
   redis-cli ping
   # Should return: PONG
   ```

2. Check Redis configuration in `.env`:
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

### TypeScript Errors

If you see TypeScript errors about missing types:

```bash
# Rebuild shared package
cd packages/shared
npm run build
cd ../..

# Reinstall dependencies
npm run clean
npm install
npm run bootstrap
```

### CORS Errors

If you see CORS errors in the browser console:

1. Check that `CORS_ORIGIN` in server `.env` matches your client URL:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

2. Restart the server after changing `.env` files

### Docker Issues

If Docker services won't start:

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

## Next Steps

Now that you have VidFlow running:

1. Explore the codebase structure (see README.md)
2. Check out the API documentation in README.md
3. Start building Phase 3: Real-time Infrastructure
4. Or work on Phase 5: Node Editor Implementation

## Getting Help

- Check the README.md for detailed documentation
- Open an issue on GitHub
- Contact the development team

## Tips for Development

1. **Use the Docker setup** - It's much easier and ensures consistency
2. **Keep terminals organized** - Use a terminal multiplexer like tmux
3. **Enable auto-save** - The hot-reload works best with auto-save enabled
4. **Use the API client** - Check `packages/client/src/api/` for examples
5. **Validate early** - Use the Zod schemas from `@vidflow/shared`

Happy coding! 🚀
