# Minimal Chatbot Application

A clean, minimal chatbot interface with a lightweight Node.js backend that connects to DataStax Astra's LangFlow API for responses.

## Features

- Single-page chatbot interface
- Clean, responsive design with micro-interactions
- Minimal Node.js backend using only core modules
- Integration with DataStax Astra's LangFlow API via user-provided API key
- API key management with local storage persistence
- Response time tracking and request feedback

## Project Structure

```
.
├── index.html      # Frontend HTML
├── styles.css      # CSS styling
├── app.js          # Frontend JavaScript 
├── index.js        # Node.js backend server
└── README.md       # This file
```

## How to Use

### 1. Start the Backend Server

Open a terminal and run:

```bash
node index.js
```

This will start the server at http://localhost:3000.

### 2. Open the Frontend

You can simply open the `index.html` file in your browser:

- Double-click on `index.html` to open it in your default web browser
- Or use a local development server if you prefer

### 3. Enter Your API Key

- Enter your DataStax Astra API key in the input field
- Click "Save" to store the key
- The key will be validated and stored in your browser's localStorage
- Once a valid key is provided, the chat input will be enabled

### 4. Start Chatting

- Type your question in the input field
- Press Enter or click the Send button
- The question will be sent to the server, which will use your API key to query DataStax Astra
- The response will appear in the chat

## API Key Information

### How to Get an API Key

To use this application, you need a DataStax Astra API key:

1. Sign up for an account at [https://astra.datastax.com/](https://astra.datastax.com/)
2. Create a token with the appropriate permissions
3. Copy the token that starts with `AstraCS:`

### Security Considerations

- Your API key is stored only in your browser's localStorage
- The key is sent securely to your local Node.js server
- The key is never exposed in browser logs or error messages
- Clear your browser's localStorage to remove the stored key

## Technical Details

### Frontend
- Pure HTML, CSS, and vanilla JavaScript
- Uses Fetch API to communicate with the backend
- Responsive design that works on mobile and desktop
- Includes subtle animations and micro-interactions

### Backend
- Minimal Node.js server using only core modules (http, https, url)
- Single `/ask` POST endpoint
- CORS enabled for local development
- Forwards requests to DataStax Astra's LangFlow API with the user-provided API key
- Error handling for various failure scenarios

## Development

To modify the application:

- Edit `index.html` to change the structure
- Edit `styles.css` to change the appearance
- Edit `app.js` to modify frontend behavior
- Edit `index.js` to change the backend logic or API integration

## Note

This is a minimal proof-of-concept intended for local development or demos, not for production use. For production, consider:

- Adding proper security measures
- Implementing user authentication
- Using environment variables for API keys (as a fallback)
- Adding HTTPS support 