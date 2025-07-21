# Voice AI Instruction Mapping Server

An Express server that receives voice-to-text input and maps it to predefined frontend instructions using Google Cloud's function-calling capabilities.

## Features

- **Multi-language Support**: Handles input in multiple languages and accents
- **Function Calling**: Uses Google Cloud Gemini API for intelligent instruction mapping
- **Robust Error Handling**: Graceful handling of unrecognized or ambiguous input
- **Security**: Input sanitization, rate limiting, and CORS protection
- **Scalable**: Modular architecture with clear separation of concerns

## Available Instructions

The server supports the following predefined instructions:

| Instruction | Description | Parameters |
|-------------|-------------|------------|
| `navigate_home` | Navigate to home page | None |
| `navigate_about` | Navigate to about page | None |
| `navigate_contact` | Navigate to contact page | None |
| `toggle_voice_input` | Switch to voice input mode | None |
| `toggle_text_input` | Switch to text input mode | None |
| `clear_input` | Clear current input and reset state | None |
| `show_help` | Show available commands and features | None |
| `enter_quantity` | Enter a specific quantity value | `quantity` (number) |
| `open_inventory` | Open inventory or product list | None |
| `go_back` | Navigate back to previous page | None |
| `open_settings` | Open settings or configuration page | None |
| `open_cart` | Open shopping cart or basket | None |

## API Endpoints

### POST /api/process-instruction

Process user input and return mapped instruction.

**Request Body:**
```json
{
  "text": "go to home page",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "instruction": "Navigate to home page",
    "action": "navigate",
    "route": "/home",
    "parameters": {},
    "success": true
  },
  "message": "Instruction processed successfully"
}
```

### GET /api/instructions

Get list of available instructions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "navigate_home",
      "description": "Navigate to the home page",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }
  ],
  "message": "Available instructions retrieved successfully"
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Installation

1. Navigate to the server directory:
```bash
cd voice-ai-app/server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Configuration

The server configuration is in `config.js`:

- **Google API Key**: Your Google Cloud API key
- **Server Port**: Default 3001
- **CORS Origin**: Allowed origins for CORS
- **Rate Limiting**: Request limits and windows
- **Instructions**: Available instruction definitions

## Multi-language Support

The server supports input in multiple languages:

- **English** (en)
- **Spanish** (es)
- **French** (fr)
- **German** (de)
- **Italian** (it)
- **Portuguese** (pt)
- **Russian** (ru)
- **Chinese** (zh)
- **Japanese** (ja)
- **Korean** (ko)
- **Arabic** (ar)
- **Hindi** (hi)

## Testing

Run the test suite to verify functionality:

```bash
node test-examples.js
```

This will test various scenarios including:
- Basic navigation commands
- Input mode toggles
- Multi-language support
- Edge cases and synonyms
- Error handling

## Example Usage

### Basic Navigation
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "go to home", "language": "en"}'
```

### Multi-language Input
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "ir a casa", "language": "es"}'
```

### Quantity Input
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "set quantity to 25", "language": "en"}'
```

## Security Features

- **Input Sanitization**: Prevents XSS attacks
- **Rate Limiting**: Prevents abuse
- **CORS Protection**: Controls cross-origin requests
- **Helmet**: Security headers
- **Request Validation**: Input validation middleware

## Error Handling

The server provides comprehensive error handling:

- **400 Bad Request**: Invalid input format
- **401 Unauthorized**: Missing API key (in production)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

## Architecture

```
server/
├── config.js              # Configuration
├── server.js              # Main server file
├── package.json           # Dependencies
├── services/
│   └── googleApiService.js # Google Cloud API integration
├── routes/
│   └── instructions.js    # API routes
├── middleware/
│   └── validation.js      # Request validation
└── test-examples.js       # Test suite
```

## Integration with Frontend

The server is designed to work with the Angular frontend. Update the frontend API service to point to the server:

```typescript
// In voice-ai-app/src/app/services/api.ts
private apiUrl = 'http://localhost:3001/api/process-instruction';
```

## Troubleshooting

### Common Issues

1. **Server won't start**: Check if port 3001 is available
2. **API errors**: Verify Google Cloud API key is valid
3. **CORS errors**: Check CORS configuration in config.js
4. **Rate limiting**: Reduce request frequency

### Logs

The server provides detailed logging:
- Request logs with timestamps
- API call details
- Error messages with stack traces
- Performance metrics

## Development

### Adding New Instructions

1. Add instruction definition to `config.js`
2. Update mapping in `googleApiService.js`
3. Add test cases to `test-examples.js`
4. Update documentation

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
GOOGLE_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## License

MIT License - see LICENSE file for details. 