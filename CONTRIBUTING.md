# Contributing to VidFlow

Thank you for your interest in contributing to VidFlow! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building something great together!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/vidflow.git`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Follow the setup guide in SETUP.md

## Development Process

### 1. Choose an Issue

- Check the [issue tracker](https://github.com/vidflow/vidflow/issues)
- Look for issues tagged with `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Make Your Changes

Follow these guidelines:

#### Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` before committing
- TypeScript strict mode is enabled - no `any` types unless absolutely necessary
- Follow the existing code structure and patterns

#### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id: any): any {
  // ...
}
```

#### React Components

```typescript
// ✅ Good - Functional components with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ Bad - No types, using class components
export class Button extends React.Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}
```

#### API Routes

```typescript
// ✅ Good - Proper error handling and validation
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = validateData(CreateProjectSchema, req.body);
    // ... implementation
    res.status(201).json({ project });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// ❌ Bad - No validation, poor error handling
export const createProject = (req, res) => {
  const project = new Project(req.body);
  project.save();
  res.json(project);
};
```

#### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase (e.g., `getUserById`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Interfaces**: PascalCase with 'I' prefix for models (e.g., `IUser`)
- **Types**: PascalCase (e.g., `User`, `CreateUser`)

### 3. Testing

Although tests aren't fully implemented yet, please ensure:

- Your code doesn't break existing functionality
- You've tested your changes manually
- API endpoints work with valid and invalid data
- UI components render correctly
- Error states are handled properly

When the testing infrastructure is ready (Phase 9):

```typescript
// Example test structure
describe('createProject', () => {
  it('should create a project with valid data', async () => {
    // ...
  });

  it('should return 400 for invalid data', async () => {
    // ...
  });

  it('should return 401 for unauthenticated users', async () => {
    // ...
  });
});
```

### 4. Commit Messages

Use clear, descriptive commit messages:

```bash
# ✅ Good
git commit -m "feat: add node deletion functionality"
git commit -m "fix: resolve CORS issue in production"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify authentication middleware"

# ❌ Bad
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat: implement real-time collaboration with Socket.io

- Add Socket.io server setup
- Implement room management
- Add cursor tracking
- Update client to connect to WebSocket

Closes #123
```

```
fix: resolve token refresh infinite loop

The refresh token logic was causing an infinite loop when
the refresh token itself was expired. Now properly handles
expired refresh tokens by redirecting to login.

Fixes #456
```

### 5. Documentation

- Update README.md if you add new features
- Add JSDoc comments for complex functions
- Update API documentation for new endpoints
- Add inline comments for complex logic

```typescript
/**
 * Encrypts sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 * @throws Error if encryption fails
 */
export const encrypt = (text: string): string => {
  // ...
};
```

## Pull Request Process

### 1. Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] Linter passes: `npm run lint`
- [ ] Builds successfully: `npm run build`

### 2. Submitting

1. Push your changes to your fork
2. Open a Pull Request to the `develop` branch
3. Fill out the PR template completely
4. Link related issues

### 3. PR Title Format

```
[Type] Brief description
```

Examples:
- `[Feature] Add video export functionality`
- `[Fix] Resolve node connection rendering issue`
- `[Docs] Update setup instructions`

### 4. PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
[Add screenshots]

## Testing
- [ ] Tested locally
- [ ] Tested in Docker
- [ ] Tested with various screen sizes (for UI changes)

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings
```

### 5. Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged
- Your contribution will be credited in the release notes

## Project Structure

When adding new files, follow this structure:

```
packages/
├── client/src/
│   ├── api/          # API client functions
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── store/        # State management
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript types (if not in shared)
├── server/src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Express middleware
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   ├── queues/       # Bull MQ jobs
│   └── sockets/      # Socket.io handlers
└── shared/src/
    ├── types/        # Shared TypeScript types
    └── utils/        # Shared utilities
```

## Working on Specific Areas

### Frontend (React)

- Use functional components with hooks
- Use Zustand for state management
- Use Tailwind CSS for styling
- Keep components small and focused
- Extract reusable logic into custom hooks

### Backend (Express)

- Use async/await, not callbacks
- Validate all input with Zod schemas
- Use proper HTTP status codes
- Handle errors with try/catch
- Add authentication to protected routes

### Database (MongoDB)

- Use Mongoose for all database operations
- Index fields used in queries
- Use virtuals for computed properties
- Add timestamps to all models

### Shared Types

- Export all types from shared package
- Use Zod schemas for validation
- Keep types DRY (Don't Repeat Yourself)

## Common Tasks

### Adding a New API Endpoint

1. Define types in `packages/shared/src/types/`
2. Create/update model in `packages/server/src/models/`
3. Create controller in `packages/server/src/controllers/`
4. Add route in `packages/server/src/routes/`
5. Register route in `packages/server/src/index.ts`
6. Add API client function in `packages/client/src/api/`
7. Update documentation

### Adding a New Page

1. Create page component in `packages/client/src/pages/`
2. Add route in `packages/client/src/App.tsx`
3. Add to navigation if needed
4. Update documentation

### Adding a New Node Type

1. Add type to `NodeType` enum in shared package
2. Update validation schemas
3. Create node component in client
4. Add to node palette
5. Update documentation

## Questions?

- Open an issue with the `question` label
- Email: dev@vidflow.com
- Check existing documentation in README.md and SETUP.md

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in the about page

Thank you for contributing to VidFlow! 🎉
