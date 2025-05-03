# Smart Scheduler with MCP Integration

A proof-of-concept application that demonstrates the integration of a resource scheduler with an AI-powered Mock Chat Provider (MCP).

## Features

- Resource management for viewing and filtering human resources
- Operations scheduling and management
- AI-powered chat interface for asking questions about resources
- Real-time filtering and data visualization

## Project Structure

The project consists of two main parts:

1. **Angular Frontend**: Located in the project root
2. **Express Backend**: Located in `src/server`

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v15 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```
   cd src/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```
   
   The server will run on http://localhost:3000

### Frontend Setup

1. From the project root, install dependencies:
   ```
   npm install
   ```

2. Start the Angular development server:
   ```
   ng serve
   ```
   
   The application will be available at http://localhost:4200

## API Endpoints

- **GET /resources** - Get all resources or filter by various criteria
- **GET /operations** - Get all operations or filter by various criteria
- **POST /ai/chat** - Send a question to the AI with resource context

## Development Notes

- The sample data is located in `src/server/data` directory
- The MCP service provides a simple mock implementation of an AI service
