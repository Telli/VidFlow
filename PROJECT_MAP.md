# VidFlow Project Map

Visual guide to the codebase structure and what each file does.

## 📁 Root Directory

```
vidflow/
├── 📄 README.md               # Main documentation - START HERE
├── 📄 QUICKSTART.md           # 5-minute setup guide
├── 📄 SETUP.md                # Detailed setup instructions
├── 📄 CONTRIBUTING.md         # How to contribute
├── 📄 ARCHITECTURE.md         # System architecture
├── 📄 STATUS.md               # Current project status
├── 📄 SUMMARY.md              # Implementation summary
├── 📄 PROJECT_MAP.md          # This file
├── 📄 LICENSE                 # MIT License
├── 📄 Makefile                # Common commands (make dev, make build, etc.)
├── 📄 package.json            # Root package - manages workspaces
├── 📄 lerna.json              # Lerna monorepo config
├── 📄 tsconfig.base.json      # Base TypeScript config
├── 📄 .eslintrc.json          # ESLint rules
├── 📄 .prettierrc             # Prettier formatting
├── 📄 .gitignore              # Git ignore rules
├── 📄 docker-compose.yml      # Docker services (MongoDB, Redis, etc.)
└── 📁 packages/               # Monorepo packages
```

---

## 📦 Packages Directory

### Overview
```
packages/
├── 📁 client/      # React frontend
├── 📁 server/      # Express backend
└── 📁 shared/      # Shared TypeScript types
```

---

## 🎨 Client Package (Frontend)

```
packages/client/
├── 📄 package.json            # Client dependencies
├── 📄 tsconfig.json           # TypeScript config
├── 📄 vite.config.ts          # Vite build config
├── 📄 tailwind.config.js      # Tailwind CSS config
├── 📄 postcss.config.js       # PostCSS config
├── 📄 .eslintrc.cjs           # ESLint config
├── 📄 index.html              # HTML entry point
├── 📄 Dockerfile              # Production Dockerfile
├── 📄 Dockerfile.dev          # Development Dockerfile
├── 📄 .env.example            # Environment variables template
│
├── 📁 public/                 # Static assets
│   └── 📄 vite.svg           # Favicon
│
└── 📁 src/                    # Source code
    ├── 📄 main.tsx            # ⭐ Entry point - React render
    ├── 📄 App.tsx             # ⭐ Main app - Routes & layout
    ├── 📄 index.css           # Global styles + Tailwind imports
    │
    ├── 📁 pages/              # 📄 Page Components
    │   ├── 📄 LoginPage.tsx          # Login form
    │   ├── 📄 RegisterPage.tsx       # Registration form
    │   ├── 📄 DashboardPage.tsx      # Project dashboard
    │   └── 📄 EditorPage.tsx         # Node editor (skeleton)
    │
    ├── 📁 components/         # 🧩 Reusable Components
    │   └── 📄 ProtectedRoute.tsx     # Route protection HOC
    │
    ├── 📁 api/                # 🔌 API Client
    │   ├── 📄 client.ts              # ⭐ Axios instance + interceptors
    │   ├── 📄 auth.ts                # Auth API calls
    │   └── 📄 projects.ts            # Project API calls
    │
    ├── 📁 store/              # 🗄️ State Management (Zustand)
    │   ├── 📄 authStore.ts           # ⭐ Auth state + tokens
    │   └── 📄 projectStore.ts        # Project state
    │
    ├── 📁 utils/              # 🛠️ Utilities
    │   └── 📄 cn.ts                  # Tailwind class merger
    │
    ├── 📁 hooks/              # 🎣 Custom Hooks (empty - Phase 5)
    │
    └── 📁 types/              # 📝 TypeScript Types (empty - uses shared)
```

### Key Files Explained

**Entry & Core**:
- `main.tsx` - React app initialization
- `App.tsx` - Route configuration, protected routes
- `index.css` - Tailwind directives, global styles

**Pages** (User-facing screens):
- `LoginPage.tsx` - Email/password login form
- `RegisterPage.tsx` - User registration form
- `DashboardPage.tsx` - Project list, create button, logout
- `EditorPage.tsx` - Editor UI skeleton (header + sidebars)

**API** (Backend communication):
- `client.ts` - Axios setup, auth interceptor, token refresh
- `auth.ts` - register(), login(), getCurrentUser()
- `projects.ts` - CRUD operations for projects

**State** (Global state):
- `authStore.ts` - User, tokens, login/logout actions
- `projectStore.ts` - Current project ID

---

## ⚙️ Server Package (Backend)

```
packages/server/
├── 📄 package.json            # Server dependencies
├── 📄 tsconfig.json           # TypeScript config
├── 📄 Dockerfile              # Production Dockerfile
├── 📄 Dockerfile.dev          # Development Dockerfile
├── 📄 .env.example            # Environment variables template
│
└── 📁 src/                    # Source code
    ├── 📄 index.ts            # ⭐ Server entry - Express setup
    │
    ├── 📁 config/             # ⚙️ Configuration
    │   ├── 📄 database.ts            # MongoDB connection
    │   └── 📄 redis.ts               # Redis client
    │
    ├── 📁 models/             # 🗄️ Database Models (Mongoose)
    │   ├── 📄 User.ts                # ⭐ User schema + password hashing
    │   ├── 📄 Project.ts             # Project schema
    │   ├── 📄 Node.ts                # Node schema
    │   └── 📄 Connection.ts          # Connection schema
    │
    ├── 📁 controllers/        # 🎮 Request Handlers
    │   ├── 📄 authController.ts      # ⭐ register, login, refresh, me
    │   ├── 📄 projectController.ts   # CRUD for projects
    │   └── 📄 nodeController.ts      # CRUD for nodes
    │
    ├── 📁 routes/             # 🛣️ API Routes
    │   ├── 📄 auth.ts                # /api/auth/*
    │   ├── 📄 projects.ts            # /api/projects/*
    │   └── 📄 nodes.ts               # /api/nodes/*
    │
    ├── 📁 middleware/         # 🚦 Express Middleware
    │   ├── 📄 auth.ts                # ⭐ JWT authentication
    │   └── 📄 errorHandler.ts        # Error handling
    │
    ├── 📁 utils/              # 🛠️ Utilities
    │   ├── 📄 jwt.ts                 # ⭐ JWT generation & verification
    │   ├── 📄 encryption.ts          # AES-256-GCM for API keys
    │   └── 📄 logger.ts              # Logging utility
    │
    ├── 📁 services/           # 💼 Business Logic (empty - Phase 6)
    │
    ├── 📁 queues/             # 📋 Background Jobs (empty - Phase 7)
    │
    └── 📁 sockets/            # 🔌 WebSocket Handlers (empty - Phase 3)
```

### Key Files Explained

**Core**:
- `index.ts` - Express setup, middleware, routes, error handling

**Config**:
- `database.ts` - MongoDB connection with error handling
- `redis.ts` - Redis client setup (ready for Phase 3)

**Models** (Database schemas):
- `User.ts` - User with password hashing, comparePassword method
- `Project.ts` - Project with owner, collaborators, settings
- `Node.ts` - Node with position, type, settings, content
- `Connection.ts` - Connection between nodes

**Controllers** (Business logic):
- `authController.ts` - register, login, refresh token, get current user
- `projectController.ts` - create, read, update, delete projects
- `nodeController.ts` - create, read, update, delete nodes

**Routes** (API endpoints):
- `auth.ts` - POST /register, POST /login, POST /refresh, GET /me
- `projects.ts` - CRUD endpoints for projects
- `nodes.ts` - CRUD endpoints for nodes

**Middleware**:
- `auth.ts` - Verifies JWT, adds user to request
- `errorHandler.ts` - Catches and formats errors

**Utils**:
- `jwt.ts` - Generate/verify access & refresh tokens
- `encryption.ts` - Encrypt/decrypt API keys
- `logger.ts` - Colored console logging

---

## 📚 Shared Package (Common Code)

```
packages/shared/
├── 📄 package.json            # Shared dependencies
├── 📄 tsconfig.json           # TypeScript config
│
└── 📁 src/
    ├── 📄 index.ts            # Exports all types & utils
    │
    ├── 📁 types/              # 📝 TypeScript Types & Schemas
    │   ├── 📄 index.ts               # Exports all types
    │   ├── 📄 user.ts                # ⭐ User, CreateUser, Login + Zod
    │   ├── 📄 project.ts             # Project, CreateProject + Zod
    │   ├── 📄 node.ts                # Node, CreateNode + Zod
    │   └── 📄 connection.ts          # Connection + Zod
    │
    └── 📁 utils/              # 🛠️ Shared Utilities
        └── 📄 validation.ts           # Zod validation helpers
```

### Key Files Explained

**Types** (Shared TypeScript types):
- `user.ts` - UserSchema, CreateUserSchema, LoginSchema (Zod)
- `project.ts` - ProjectSchema, CreateProjectSchema, UpdateProjectSchema
- `node.ts` - NodeSchema, NodeType enum, AIProvider enum
- `connection.ts` - ConnectionSchema, ConnectionType enum

**Utils**:
- `validation.ts` - validateData(), validateDataSafe() helpers

---

## 🐳 Docker Configuration

```
docker-compose.yml              # Defines services

Services:
├── mongodb     → localhost:27017    # Database
├── redis       → localhost:6379     # Cache/Queue
├── server      → localhost:3001     # API
└── client      → localhost:5173     # UI
```

---

## 🔧 GitHub Configuration

```
.github/
├── 📁 workflows/
│   └── 📄 ci.yml              # CI/CD pipeline (lint, build, test)
│
├── 📁 ISSUE_TEMPLATE/
│   ├── 📄 bug_report.md       # Bug report template
│   └── 📄 feature_request.md  # Feature request template
│
└── 📄 pull_request_template.md # PR template
```

---

## 🗺️ Data Flow Diagram

### User Login Flow
```
LoginPage.tsx (User enters credentials)
    ↓
authApi.login() (POST /api/auth/login)
    ↓
authController.login() (Validate credentials)
    ↓
User.comparePassword() (Check password)
    ↓
generateAccessToken() + generateRefreshToken()
    ↓
Return tokens to client
    ↓
authStore.setAuth() (Store in Zustand + localStorage)
    ↓
Navigate to /dashboard
```

### Project Creation Flow
```
DashboardPage.tsx (User clicks "New Project")
    ↓
projectsApi.create() (POST /api/projects)
    ↓
authenticate middleware (Verify JWT)
    ↓
projectController.create() (Validate & create)
    ↓
new Project().save() (Save to MongoDB)
    ↓
Return project data
    ↓
Navigate to /editor/:projectId
```

---

## 🎯 Where to Start

### For New Developers

1. **Frontend Changes**:
   - Start: `packages/client/src/pages/DashboardPage.tsx`
   - Change: Update the greeting text
   - See: Hot reload in browser

2. **Backend Changes**:
   - Start: `packages/server/src/controllers/authController.ts`
   - Change: Modify the success message
   - See: API response changes

3. **Type Changes**:
   - Start: `packages/shared/src/types/project.ts`
   - Add: New field to ProjectSchema
   - Build: `cd packages/shared && npm run build`
   - Use: Update model and UI

### For Phase 5 (Node Editor)

Focus on these files:
- `packages/client/src/components/Canvas/` (create)
- `packages/client/src/components/Nodes/` (create)
- `packages/client/src/store/editorStore.ts` (create)
- `packages/client/src/pages/EditorPage.tsx` (enhance)

### For Phase 3 (Real-time)

Focus on these files:
- `packages/server/src/sockets/` (create)
- `packages/server/src/queues/` (create)
- `packages/client/src/hooks/useSocket.ts` (create)

---

## 📊 File Statistics

| Category | Files | Lines |
|----------|-------|-------|
| Frontend | 15 | ~800 |
| Backend | 19 | ~1,200 |
| Shared | 7 | ~250 |
| Config | 10 | ~450 |
| Docs | 7 | ~1,800 |
| **Total** | **58** | **~4,500** |

---

## 🔍 Find Files Quickly

### Search by Feature

**Authentication**:
- Frontend: `packages/client/src/pages/LoginPage.tsx`
- Backend: `packages/server/src/controllers/authController.ts`
- Types: `packages/shared/src/types/user.ts`

**Projects**:
- Frontend: `packages/client/src/pages/DashboardPage.tsx`
- Backend: `packages/server/src/controllers/projectController.ts`
- Types: `packages/shared/src/types/project.ts`

**API Client**:
- Setup: `packages/client/src/api/client.ts`
- Auth: `packages/client/src/api/auth.ts`
- Projects: `packages/client/src/api/projects.ts`

**State Management**:
- Auth: `packages/client/src/store/authStore.ts`
- Project: `packages/client/src/store/projectStore.ts`

---

## 🚀 Quick Commands

```bash
# Start everything
make dev               # or: npm run dev

# Build everything
make build             # or: npm run build

# Clean everything
make clean             # or: npm run clean

# Lint code
make lint              # or: npm run lint

# Check status
make status

# Docker
make docker-up         # Start services
make docker-down       # Stop services
make docker-logs       # View logs
```

---

This map should help you navigate the codebase quickly. Use it as a reference when exploring or making changes! 🗺️
