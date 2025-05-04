# Smart Scheduler Backend

Backend server for the Smart Scheduler application with MCP (Mock Chat Provider) integration.

## Features

- RESTful API for managing resources and operations
- Mock AI chat service for answering questions about resources and schedules
- Swagger documentation for API endpoints
- Data models for resources and operations

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies

```bash
cd backend
npm install
```

### Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Documentation

API documentation is available via Swagger UI at:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Resources

- `GET /api/resources` - Get all resources with optional filtering
- `GET /api/resources/{id}` - Get resource by ID
- `POST /api/resources` - Create a new resource
- `PUT /api/resources/{id}` - Update a resource
- `DELETE /api/resources/{id}` - Delete a resource

### Operations

- `GET /api/operations` - Get all operations with optional filtering
- `GET /api/operations/{id}` - Get operation by ID
- `POST /api/operations` - Create a new operation
- `PUT /api/operations/{id}` - Update an operation
- `DELETE /api/operations/{id}` - Delete an operation

### AI Chat

- `POST /api/ai/chat` - Process a chat request with AI

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development, production)
- `MCP_BASE_URL` - Base URL for the MCP API
- `MCP_API_KEY` - API key for the MCP service
- `USE_MOCK_RESPONSES` - Use mock responses for MCP service (default: true)

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── data/           # Mock data
├── models/         # Data models
├── routes/         # API routes
├── services/       # Business logic
├── server.js       # Server entry point
└── swagger.js      # Swagger configuration
``` 