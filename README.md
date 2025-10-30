# VidFlow - AI-Powered Node-Based Video Editor

VidFlow is a modern, AI-powered video editor that uses a node-based interface to create professional videos. Built with React, TypeScript, Express, and MongoDB.

## 🌟 Features

### Phase 1: Foundation (✅ Complete)
- ✅ Monorepo structure with Lerna
- ✅ TypeScript configuration across all packages
- ✅ ESLint & Prettier setup
- ✅ Shared types and utilities
- ✅ Docker development environment

### Phase 2: Backend Core (✅ Complete)
- ✅ Express server with TypeScript
- ✅ JWT authentication system
- ✅ MongoDB integration with Mongoose
- ✅ User, Project, Node, and Connection models
- ✅ RESTful CRUD APIs
- ✅ Error handling middleware
- ✅ Request validation

### Phase 3: Real-time Infrastructure (🚧 Next)
- ⏳ Socket.io integration
- ⏳ Redis pub/sub
- ⏳ Bull MQ for job queues
- ⏳ Real-time collaboration

### Phase 4: Frontend Foundation (✅ Complete)
- ✅ React + Vite + TypeScript
- ✅ Tailwind CSS styling
- ✅ React Router setup
- ✅ Zustand state management
- ✅ Authentication UI (Login/Register)
- ✅ Dashboard with project management
- ✅ Protected routes
- ✅ API client with axios

### Phase 5: Node Editor (🚧 Next)
- ⏳ Canvas with pan/zoom
- ⏳ Node components (Scene, Audio, Manim, Transition)
- ⏳ Drag and drop functionality
- ⏳ Connection system
- ⏳ Undo/redo

## 🏗️ Project Structure

```
vidflow/
├── packages/
│   ├── client/          # React frontend
│   │   ├── src/
│   │   │   ├── api/          # API client
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Page components
│   │   │   ├── store/        # Zustand stores
│   │   │   └── utils/        # Utilities
│   │   └── package.json
│   ├── server/          # Express backend
│   │   ├── src/
│   │   │   ├── config/       # Configuration
│   │   │   ├── controllers/  # Route controllers
│   │   │   ├── middleware/   # Express middleware
│   │   │   ├── models/       # Mongoose models
│   │   │   ├── routes/       # API routes
│   │   │   ├── services/     # Business logic
│   │   │   └── utils/        # Utilities
│   │   └── package.json
│   └── shared/          # Shared types
│       ├── src/
│       │   ├── types/        # TypeScript types
│       │   └── utils/        # Shared utilities
│       └── package.json
├── docker-compose.yml
├── lerna.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (optional)
- MongoDB (if not using Docker)
- Redis (if not using Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vidflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run bootstrap
   ```

3. **Set up environment variables**

   For server (`packages/server/.env`):
   ```bash
   cp packages/server/.env.example packages/server/.env
   ```
   
   Edit the `.env` file with your configuration.

   For client (`packages/client/.env`):
   ```bash
   cp packages/client/.env.example packages/client/.env
   ```

4. **Start with Docker (Recommended)**
   ```bash
   docker-compose up
   ```

   Or **start manually**:
   
   - Start MongoDB and Redis
   - Build shared package:
     ```bash
     cd packages/shared && npm run build
     ```
   - Start server:
     ```bash
     cd packages/server && npm run dev
     ```
   - Start client (in another terminal):
     ```bash
     cd packages/client && npm run dev
     ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Project Endpoints

#### Create Project
```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "My Project",
  "description": "Optional description"
}
```

#### Get All Projects
```http
GET /api/projects
Authorization: Bearer <access_token>
```

#### Get Project
```http
GET /api/projects/:id
Authorization: Bearer <access_token>
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <access_token>
```

### Node Endpoints

#### Create Node
```http
POST /api/nodes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "projectId": "project_id",
  "type": "scene",
  "position": { "x": 100, "y": 100 }
}
```

#### Get Nodes by Project
```http
GET /api/nodes/project/:projectId
Authorization: Bearer <access_token>
```

#### Update Node
```http
PUT /api/nodes/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "position": { "x": 200, "y": 200 }
}
```

#### Delete Node
```http
DELETE /api/nodes/:id
Authorization: Bearer <access_token>
```

## 🔧 Development

### Available Scripts

#### Root Level
- `npm run dev` - Start all packages in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all node_modules and build artifacts

#### Client Package
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint TypeScript files

#### Server Package
- `npm run dev` - Start with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run lint` - Lint TypeScript files

#### Shared Package
- `npm run dev` - Build in watch mode
- `npm run build` - Compile TypeScript
- `npm run lint` - Lint TypeScript files

## 🔐 Security

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for authentication
- API keys encrypted with AES-256-GCM
- CORS protection
- Helmet.js for security headers
- Request validation with Zod

## 🧪 Testing

Testing suite coming in Phase 9:
- Unit tests with Jest
- Integration tests for APIs
- Component tests with React Testing Library
- E2E tests with Playwright

## 📦 Deployment

Deployment configuration coming in Phase 10:
- Docker multi-stage builds
- CI/CD with GitHub Actions
- Cloud deployment (AWS/GCP/Azure)
- Monitoring with Sentry

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🗺️ Roadmap

**Current Status: 40% Complete** 🎉

- [x] **Phase 1**: Project Setup and Foundation ✅
- [x] **Phase 2**: Backend Core (Express + MongoDB) ✅
- [ ] **Phase 3**: Real-time Infrastructure 🚧 Next
- [x] **Phase 4**: Frontend Foundation (React + TypeScript) ✅
- [ ] **Phase 5**: Node Editor Implementation 🚧 Recommended Next
- [ ] **Phase 6**: AI Provider Integration
- [ ] **Phase 7**: Video Generation Pipeline
- [ ] **Phase 8**: Collaboration Features
- [ ] **Phase 9**: Polish and Optimization
- [ ] **Phase 10**: Deployment

**What's Working Now:**
- ✅ User registration and authentication
- ✅ Project creation and management
- ✅ Dashboard with project list
- ✅ API endpoints for projects and nodes
- ✅ Token-based security
- ✅ Docker development environment

**What's Next:**
- Option A: Build real-time collaboration (Phase 3)
- Option B: Build visual node editor (Phase 5) 👈 Recommended

## 💡 Key Technologies

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Flow
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB, Redis
- **Queue**: Bull MQ
- **Real-time**: Socket.io
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **State Management**: Zustand
- **Video Processing**: FFmpeg
- **AI Providers**: OpenAI, Anthropic, Google AI, Stability AI

## 📧 Support

For support, email support@vidflow.com or open an issue in the repository.

---

Built with ❤️ by the VidFlow team
