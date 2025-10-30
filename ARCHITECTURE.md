# VidFlow Architecture

This document describes the architecture of VidFlow, an AI-powered node-based video editor.

## System Overview

VidFlow follows a modern monorepo architecture with clear separation between frontend, backend, and shared code.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Client)                 │  │
│  │  - React 18 + TypeScript                            │  │
│  │  - Vite for build                                   │  │
│  │  - Tailwind CSS for styling                         │  │
│  │  - React Flow for node editor                       │  │
│  │  - Zustand for state management                     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST + WebSocket
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Express API Server                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Application Layer                       │  │
│  │  - Express.js + TypeScript                          │  │
│  │  - JWT Authentication                               │  │
│  │  - Socket.io for real-time                          │  │
│  │  - RESTful API endpoints                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                    │  │
│  │  - Controllers (request handling)                   │  │
│  │  - Services (business logic)                        │  │
│  │  - Middleware (auth, validation, errors)            │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────┬──────────────────────┬──────────────────────────┘
            │                      │
            │                      │
    ┌───────▼─────────┐    ┌──────▼────────┐
    │    MongoDB      │    │     Redis     │
    │  - User data    │    │  - Sessions   │
    │  - Projects     │    │  - Cache      │
    │  - Nodes        │    │  - Pub/Sub    │
    │  - Connections  │    │  - Job Queue  │
    └─────────────────┘    └───────────────┘
```

## Architecture Layers

### 1. Frontend Layer (Client)

**Technology**: React 18, TypeScript, Vite

**Responsibilities**:
- User interface rendering
- User interactions
- State management
- API communication
- WebSocket connections
- Node editor canvas

**Key Components**:
```
src/
├── pages/           # Route-based page components
├── components/      # Reusable UI components
├── store/          # Zustand state stores
├── api/            # API client functions
├── hooks/          # Custom React hooks
└── utils/          # Utility functions
```

**State Management**:
- **Zustand** for global state
- **React Context** for component-level state
- **Local Storage** for persistence (auth tokens)

### 2. Backend Layer (Server)

**Technology**: Express.js, TypeScript, Node.js

**Responsibilities**:
- Request routing and handling
- Authentication and authorization
- Business logic execution
- Database operations
- AI provider integration
- Video processing
- Real-time communication

**Key Components**:
```
src/
├── routes/          # API route definitions
├── controllers/     # Request handlers
├── services/        # Business logic
├── middleware/      # Express middleware
├── models/         # Database models
├── utils/          # Utility functions
├── queues/         # Background jobs
└── sockets/        # WebSocket handlers
```

**API Design**:
- RESTful endpoints for CRUD operations
- JWT-based authentication
- Request validation with Zod
- Standardized error responses

### 3. Data Layer

#### MongoDB (Primary Database)

**Collections**:
- `users` - User accounts and profiles
- `projects` - Video projects
- `nodes` - Individual nodes in projects
- `connections` - Connections between nodes

**Indexing Strategy**:
```javascript
// User
{ email: 1 } // Unique index for login

// Project
{ ownerId: 1 }
{ 'collaborators.userId': 1 }

// Node
{ projectId: 1 }

// Connection
{ projectId: 1 }
{ fromNodeId: 1, toNodeId: 1 } // Unique compound index
```

#### Redis (Cache & Queue)

**Use Cases**:
- Session storage
- API response caching
- Rate limiting counters
- Pub/Sub for scaling
- Job queue (Bull MQ)

### 4. Shared Layer

**Technology**: TypeScript

**Purpose**: Share types, schemas, and utilities between frontend and backend

**Contents**:
- TypeScript interfaces and types
- Zod validation schemas
- Shared constants
- Common utilities

## Data Flow

### Authentication Flow

```
1. User submits login form
   ↓
2. Client sends POST /api/auth/login
   ↓
3. Server validates credentials
   ↓
4. Server generates JWT tokens
   ↓
5. Client stores tokens
   ↓
6. Client includes token in subsequent requests
   ↓
7. Server validates token on each request
   ↓
8. Token expires → Client refreshes using refresh token
```

### Project Creation Flow

```
1. User creates new project
   ↓
2. Client sends POST /api/projects
   ↓
3. Server validates request
   ↓
4. Server creates project in MongoDB
   ↓
5. Server returns project data
   ↓
6. Client updates UI
   ↓
7. Client navigates to editor
```

### Node Editor Flow (Real-time)

```
1. User drags node onto canvas
   ↓
2. Client creates node locally
   ↓
3. Client sends POST /api/nodes
   ↓
4. Server saves node to MongoDB
   ↓
5. Server broadcasts via Socket.io
   ↓
6. Other connected clients receive update
   ↓
7. All clients update their canvas
```

### AI Content Generation Flow

```
1. User configures node settings
   ↓
2. User triggers generation
   ↓
3. Client sends generation request
   ↓
4. Server creates job in Bull MQ
   ↓
5. Worker picks up job
   ↓
6. Worker calls AI provider API
   ↓
7. Worker streams response via SSE
   ↓
8. Client updates node in real-time
   ↓
9. Worker saves result to MongoDB
   ↓
10. Server broadcasts completion
```

## Security Architecture

### Authentication

**Method**: JWT (JSON Web Tokens)

**Token Types**:
- **Access Token**: Short-lived (24h), used for API requests
- **Refresh Token**: Long-lived (7d), used to get new access tokens

**Flow**:
```
Client Request
    ↓
Authorization: Bearer <access_token>
    ↓
Auth Middleware validates token
    ↓
If valid: Continue to route handler
If expired: Return 401
    ↓
Client uses refresh token to get new access token
```

### Data Protection

**Passwords**:
- Hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

**API Keys**:
- Encrypted with AES-256-GCM
- Stored encrypted in database
- Decrypted only when needed

**HTTPS**:
- All production traffic over HTTPS
- HSTS headers enabled
- Certificate pinning recommended

### Authorization

**Project Access Control**:
```javascript
// User roles
Owner: Full control
Admin: Edit + Manage collaborators
Editor: Edit content
Viewer: Read-only
```

**Middleware Check**:
```javascript
1. Verify user is authenticated
2. Check project ownership or collaboration
3. Verify role has required permissions
4. Allow or deny request
```

## Scalability Strategy

### Horizontal Scaling

**Load Balancing**:
```
                    ┌─────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼───┐         ┌────▼───┐        ┌────▼───┐
    │Server 1│         │Server 2│        │Server 3│
    └────────┘         └────────┘        └────────┘
```

**Session Management**:
- Redis for shared session storage
- Sticky sessions not required

### Database Scaling

**MongoDB**:
- Replica sets for high availability
- Sharding for horizontal scaling
- Read replicas for read-heavy operations

**Redis**:
- Redis Cluster for distribution
- Separate instances for different use cases

### Queue System

**Bull MQ with Redis**:
- Distributed job processing
- Multiple workers on different servers
- Priority queues for important jobs
- Retry mechanism for failed jobs

## Performance Optimization

### Frontend

- **Code Splitting**: Route-based lazy loading
- **Asset Optimization**: Image compression, lazy loading
- **Virtual Scrolling**: For large node lists
- **Memoization**: React.memo, useMemo, useCallback
- **Service Worker**: For offline support

### Backend

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Query Optimization**: Projection, pagination, lean queries
- **Caching**: Redis for expensive operations
- **Connection Pooling**: MongoDB connection pool
- **Compression**: gzip/brotli for API responses

### Real-time

- **WebSocket Compression**: Per-message deflate
- **Event Throttling**: Limit update frequency
- **Batch Updates**: Combine multiple updates
- **Selective Broadcasting**: Only to relevant clients

## Monitoring and Observability

### Logging

**Levels**:
- ERROR: Critical issues
- WARN: Warning conditions
- INFO: Informational messages
- DEBUG: Detailed debug info (dev only)

**Structure**:
```json
{
  "timestamp": "2025-10-30T12:00:00Z",
  "level": "ERROR",
  "message": "Failed to create node",
  "userId": "123",
  "projectId": "456",
  "error": "..."
}
```

### Metrics (Future)

- Request latency
- Error rates
- Database query times
- Cache hit rates
- WebSocket connection count
- Job queue length

### Health Checks

**Endpoint**: `GET /health`

**Checks**:
- Server is running
- MongoDB connection
- Redis connection
- Disk space
- Memory usage

## Disaster Recovery

### Backup Strategy

**MongoDB**:
- Daily automated backups
- Point-in-time recovery
- Off-site backup storage

**Redis**:
- RDB snapshots
- AOF persistence (optional)
- Not critical (can rebuild from MongoDB)

### Recovery Plan

1. Detect failure
2. Switch to backup server/database
3. Restore latest backup if needed
4. Verify data integrity
5. Resume operations
6. Post-mortem analysis

## Technology Decisions

### Why MongoDB?

- Flexible schema for evolving node types
- Good performance for document operations
- Native JSON support
- Horizontal scaling capabilities
- Rich query language

### Why Redis?

- Fast in-memory data structure store
- Pub/Sub for real-time scaling
- Native job queue support
- TTL for automatic expiration
- Wide ecosystem support

### Why React?

- Large ecosystem and community
- Excellent TypeScript support
- Virtual DOM for performance
- Rich library ecosystem (React Flow)
- Easy to find developers

### Why Express?

- Minimal and flexible
- Large middleware ecosystem
- Well-documented
- Easy to learn and use
- TypeScript support

### Why Socket.io?

- Automatic fallback to polling
- Room management built-in
- Reconnection handling
- Binary support
- Cross-browser compatibility

## Future Architecture Evolution

### Phase 6-10 Additions

**AI Service Layer**:
- Dedicated AI service for provider abstraction
- Request queuing and rate limiting
- Cost tracking and optimization

**Video Processing Service**:
- FFmpeg integration
- Thumbnail generation
- Format conversion
- Cloud storage integration

**Analytics Service**:
- Usage tracking
- Performance metrics
- User behavior analysis

**CDN Integration**:
- CloudFront/Cloudflare for media delivery
- Edge caching for API responses
- DDoS protection

---

This architecture provides a solid foundation for building a scalable, maintainable, and secure video editing platform. Each component is designed to be independently upgradable and replaceable as the product evolves.
