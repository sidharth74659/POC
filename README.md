```bash
cloudflared tunnel run --url http://localhost:3000 hubnest-tunnel
```

---

# Multi-Tenant SaaS Application

A full-stack monorepo with Angular frontend and Node.js backend, featuring multi-tenant architecture.

## 🏗️ Project Structure

```
multi-tenant-saas/
├── angular-app/          # Angular frontend application
├── backend/             # Node.js/Express backend API
├── shared-schemas-zod/  # Shared Zod schemas
└── deploy/             # Deployment configurations
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.19.0
- npm >= 10.0.0

### Installation

```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install
npm install --workspace=backend
npm install --workspace=angular-app
```

### Development

```bash
# Start both backend and frontend in development mode
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend
```

### Production Build

```bash
# Build both applications
npm run build

# Build only backend
npm run build:backend

# Build only frontend
npm run build:frontend
```

## 📋 Available Scripts

### Root Level (Monorepo)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run build` | Build both applications |
| `npm run start` | Start both applications in production mode |
| `npm run clean` | Clean build artifacts from both apps |
| `npm run lint` | Lint both applications |
| `npm run test` | Run tests for both applications |
| `npm run type-check` | Type check both applications |
| `npm run setup` | Install dependencies and build applications |
| `npm run reset` | Clean, reinstall, and rebuild everything |

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run test` | Run backend tests |
| `npm run lint` | Lint TypeScript files |
| `npm run type-check` | Type check without emitting |
| `npm run clean` | Remove build artifacts |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start development server |
| `npm run test` | Run unit tests |
| `npm run lint` | Lint Angular files |
| `npm run type-check` | Type check without emitting |
| `npm run analyze` | Analyze bundle size |

## 🔧 Development Workflow

### 1. Development Mode
```bash
npm run dev
```
This starts both applications with hot reload:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:4200`

### 2. Individual Development
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### 3. Building for Production
```bash
npm run build
```
This creates optimized builds in:
- Backend: `backend/dist/`
- Frontend: `angular-app/dist/angular-app/`

### 4. Code Quality
```bash
# Lint both applications
npm run lint

# Fix linting issues
npm run lint:fix

# Type check both applications
npm run type-check

# Validate code quality
npm run validate
```

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Multi-tenancy**: Subdomain-based tenant isolation

### Frontend (Angular)
- **Framework**: Angular 20 with standalone components
- **Styling**: SCSS with design tokens
- **State Management**: Angular Signals
- **Routing**: Angular Router with guards
- **HTTP**: Angular HttpClient with interceptors

### Shared Schemas
- **Validation**: Zod schemas shared between frontend and backend
- **Type Safety**: TypeScript interfaces generated from schemas

## 🔒 Environment Configuration

Create environment files for each workspace:

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/multi-tenant-saas
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:4200
```

### Frontend (src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  tenantDomain: 'hubnest.live'
};
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
cd deploy
docker-compose up -d
```

### Manual Deployment
```bash
# Build applications
npm run build

# Start production servers
npm run start
```

## 📊 Monitoring and Debugging

### Bundle Analysis
```bash
# Analyze frontend bundle
npm run analyze
```

### Performance Monitoring
- Backend: Morgan logging middleware
- Frontend: Angular DevTools
- Database: MongoDB query optimization

## 🧪 Testing

### Backend Testing
```bash
npm run test --workspace=backend
```

### Frontend Testing
```bash
npm run test --workspace=angular-app
```

### E2E Testing
```bash
# Using Playwright (if configured)
npm run test:e2e
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Backend: Change PORT in .env
   - Frontend: Use `--port` flag with ng serve

2. **Build Failures**
   ```bash
   npm run clean
   npm run install:all
   npm run build
   ```

3. **TypeScript Errors**
   ```bash
   npm run type-check
   npm run lint:fix
   ```

4. **Node Version Issues**
   ```bash
   nvm use 20.19.0
   npm run reset
   ```

### Development Tips

1. **Hot Reload**: Both apps support hot reload for development
2. **Type Safety**: Use `npm run type-check` before committing
3. **Code Quality**: Run `npm run validate` before pushing
4. **Bundle Size**: Use `npm run analyze` to monitor frontend bundle size

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---
---

```bash
    "ng": "ng",
    "start": "ng serve --port 4200 --host 0.0.0.0",
    "dev": "ng serve --port 4200 --host 0.0.0.0 --watch",
    "build": "ng build --configuration production",
    "build:dev": "ng build --configuration development",
    "build:watch": "ng build --watch --configuration development",
    "build:prod": "ng build --configuration production",
    "test": "ng test --watch=false --browsers=ChromeHeadless",
    "test:watch": "ng test",
    "lint": "ng lint --max-warnings 0",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,scss,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\"",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist",
    "clean:all": "rimraf dist node_modules package-lock.json",
    "prebuild": "npm run clean",
    "postbuild": "echo 'Angular build completed successfully'",
    "predev": "npm run type-check",
    "validate": "npm run lint && npm run type-check && npm run format:check",
    "reset": "npm run clean:all && npm install && npm run build",
    "analyze": "ng build --configuration production --stats-json && npx webpack-bundle-analyzer dist/angular-app/stats.json"


    "dev": "concurrently --kill-others --names \"backend,frontend\" --prefix-colors \"blue,green\" \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "npm run dev --workspace=backend",
    "dev:frontend": "npm run dev --workspace=angular-app",
    "build": "npm run clean && npm run build:backend && npm run build:frontend",
    "build:backend": "npm run build --workspace=backend",
    "build:frontend": "npm run build --workspace=angular-app",
    "start": "concurrently --kill-others --names \"backend,frontend\" --prefix-colors \"blue,green\" \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "npm run start --workspace=backend",
    "start:frontend": "npm run start --workspace=angular-app",
    "clean": "npm run clean:backend && npm run clean:frontend",
    "clean:backend": "npm run clean --workspace=backend",
    "clean:frontend": "npm run clean --workspace=angular-app",
    "lint": "npm run lint:backend && npm run lint:frontend",
    "lint:backend": "npm run lint --workspace=backend",
    "lint:frontend": "npm run lint --workspace=angular-app",
    "lint:fix": "npm run lint:fix:backend && npm run lint:fix:frontend",
    "lint:fix:backend": "npm run lint:fix --workspace=backend",
    "lint:fix:frontend": "npm run lint:fix --workspace=angular-app",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "npm run test --workspace=backend",
    "test:frontend": "npm run test --workspace=angular-app",
    "type-check": "npm run type-check:backend && npm run type-check:frontend",
    "type-check:backend": "npm run type-check --workspace=backend",
    "type-check:frontend": "npm run type-check --workspace=angular-app",
    "install:all": "npm install && npm install --workspace=backend && npm install --workspace=angular-app",
    "setup": "npm run install:all && npm run build",
    "reset": "npm run clean && npm run install:all && npm run build"



    "test": "ts-node test-server.ts",
    "test:watch": "nodemon --exec \"ts-node test-server.ts\" --watch src --ext ts",
    "lint": "eslint ./src --ext .ts --max-warnings 0",
    "lint:fix": "eslint ./src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.{ts,js,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,js,json}\"",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist",
    "clean:all": "rimraf dist node_modules package-lock.json",
    "prebuild": "npm run clean",
    "postbuild": "echo 'Backend build completed successfully'",
    "predev": "npm run type-check",
    "validate": "npm run lint && npm run type-check && npm run format:check",
    "reset": "npm run clean:all && npm install && npm run build"
   ```