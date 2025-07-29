
```
MONGO_URI='mongodb://localhost:27017/' node backend.js

npm run dev:full


npm run dev
```

---

# MongoDB Viewer

A modern, feature-rich MongoDB database explorer with dynamic connection support, real-time document viewing, and advanced search capabilities.

## Features

### 🔌 Dynamic Connection
- Connect to any MongoDB instance using standard connection URIs
- Support for both local and remote MongoDB connections
- Real-time connection validation and error handling

### 📊 Advanced Document Viewing
- **Table View**: Sortable columns with search functionality
- **Accordion View**: Expandable document details
- **Card View**: Compact document cards (coming soon)

### 🔍 Search & Filter
- Global search across all document fields
- Real-time filtering with result counters
- Support for nested object searching

### 🎨 Dark Mode Support
- Complete dark mode implementation
- Smooth theme transitions
- Consistent styling across all components

### 📱 Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** native driver
- **CORS** enabled for cross-origin requests
- **Dynamic connection management**

### Frontend
- **Next.js 15** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Radix UI** components

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB instance (local or remote)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd 34.mongodb-viewer
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev:full
   ```

3. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:4000

### Available Scripts

#### Development
```bash
npm run dev:full          # Start both frontend and backend in development mode
npm run dev               # Start backend only
npm run frontend:dev      # Start frontend only
```

#### Production
```bash
npm run build:full        # Build frontend for production
npm run start:full        # Start both servers in production mode
npm run start             # Start backend only
npm run frontend:start    # Start frontend only
```

#### Maintenance
```bash
npm run install:all       # Install all dependencies
npm run clean             # Clean build artifacts
npm run reset             # Clean and reinstall everything
npm run lint              # Run ESLint
npm run lint:fix          # Fix linting issues
```

## API Endpoints

### Connection Management
- `POST /connect` - Establish MongoDB connection
- `GET /databases/:connectionId` - List all databases
- `GET /collections/:connectionId/:db` - List collections in database
- `GET /documents/:connectionId/:db/:col` - Get documents from collection

### Example Usage
```bash
# Connect to MongoDB
curl -X POST http://localhost:4000/connect \
  -H "Content-Type: application/json" \
  -d '{"uri": "mongodb://localhost:27017/"}'

# List databases
curl http://localhost:4000/databases/{connectionId}

# Get collections
curl http://localhost:4000/collections/{connectionId}/admin

# Get documents
curl http://localhost:4000/documents/{connectionId}/admin/system.version
```

## Features in Detail

### Table View Enhancements
- **Sortable Columns**: Click column headers to sort data
- **Smart Column Widths**: Automatic width adjustment based on content
- **Cell Overflow Handling**: Truncated content with click-to-copy functionality
- **Search Integration**: Filter documents across all fields
- **Dark Mode**: Complete dark theme support

### Connection Features
- **URI Validation**: Real-time MongoDB URI format validation
- **Connection Persistence**: Maintains active connections with unique IDs
- **Error Handling**: Comprehensive error messages and recovery
- **Cross-Platform**: Works with local and remote MongoDB instances

### UI/UX Improvements
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized for large datasets
- **Visual Feedback**: Toast notifications and loading states

## Development Workflow

### Hot Reload Development
The development setup includes:
- **Backend**: Nodemon for automatic server restart
- **Frontend**: Next.js with Turbopack for fast refresh
- **Concurrent**: Both servers run simultaneously

### File Watching
- Backend restarts on `.js` file changes
- Frontend hot reloads on component changes
- Build artifacts are automatically cleaned

### Cross-Platform Support
- Works on Windows, macOS, and Linux
- Uses cross-platform npm scripts
- Consistent development experience

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using the ports
   lsof -i :3001
   lsof -i :4000
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Test MongoDB connection
   mongosh "mongodb://localhost:27017/"
   ```

3. **Build Issues**
   ```bash
   # Clean and rebuild
   npm run reset
   ```

### Performance Tips
- Use the search feature to filter large datasets
- Enable dark mode for better eye comfort
- Use table view for structured data analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in both light and dark modes
5. Submit a pull request

## License

ISC License - see LICENSE file for details. 