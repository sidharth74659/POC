# Voice AI Instruction Mapping API Documentation

## Overview

The Voice AI Instruction Mapping API is a comprehensive REST API that processes natural language input (voice or text) and returns structured instructions using Google Cloud Vertex AI function-calling capabilities. The API supports multiple languages and can handle various types of instructions including navigation, input mode toggles, system commands, and data entry.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.voice-ai-app.com`

## Authentication

The API uses API key authentication via the `x-api-key` header:

```bash
curl -H "x-api-key: your-api-key" \
     -H "Content-Type: application/json" \
     -d '{"text": "go to home"}' \
     http://localhost:3001/api/process-instruction
```

## API Endpoints

### 1. Process Instruction

**POST** `/api/process-instruction`

Processes natural language input and returns a structured instruction with action, route, and parameters.

#### Request Body

```json
{
  "text": "go to home page",
  "language": "en"
}
```

#### Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `text` | string | Yes | User input text or voice transcription | "go to home page" |
| `language` | string | No | Language code (default: "en") | "en", "es", "fr" |

#### Response

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

#### Example Requests

**Navigation Instruction:**
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "go to about page", "language": "en"}'
```

**Voice Mode Toggle:**
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "switch to voice mode", "language": "en"}'
```

**Quantity Entry:**
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "set quantity to twenty five", "language": "en"}'
```

**Spanish Navigation:**
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -d '{"text": "ir a la página de contacto", "language": "es"}'
```

### 2. Get Available Instructions

**GET** `/api/instructions`

Returns a list of all available instructions that the system can process.

#### Response

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
    },
    {
      "name": "enter_quantity",
      "description": "Enter a specific quantity value",
      "parameters": {
        "type": "object",
        "properties": {
          "quantity": {
            "type": "number",
            "description": "The quantity value to enter"
          }
        },
        "required": ["quantity"]
      }
    }
  ],
  "message": "Available instructions retrieved successfully"
}
```

#### Example Request

```bash
curl -X GET http://localhost:3001/api/instructions \
  -H "Content-Type: application/json"
```

### 3. Health Check

**GET** `/api/health`

Returns the current health status of the server.

#### Response

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### Example Request

```bash
curl -X GET http://localhost:3001/api/health
```

## Supported Actions

The API supports the following actions:

| Action | Description | Parameters | Example Input |
|--------|-------------|------------|---------------|
| `navigate` | Navigate to a specific route | `route` | "go to home" |
| `toggle_input` | Switch input mode | `mode` | "switch to voice mode" |
| `clear_input` | Clear current input | None | "clear everything" |
| `show_help` | Show available commands | None | "show help" |
| `enter_quantity` | Enter quantity value | `quantity` | "set quantity to 25" |
| `open_inventory` | Open inventory | None | "open inventory" |
| `go_back` | Navigate back | None | "go back" |
| `open_settings` | Open settings | None | "open settings" |
| `open_cart` | Open shopping cart | None | "open cart" |

## Supported Languages

The API supports the following languages:

- **English** (`en`) - Default
- **Spanish** (`es`)
- **French** (`fr`)
- **German** (`de`)
- **Italian** (`it`)
- **Portuguese** (`pt`)
- **Japanese** (`ja`)
- **Korean** (`ko`)
- **Chinese** (`zh`)

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - API key required |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": "Invalid request",
  "message": "Text field is required and must be a string"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per 15 minutes
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## CORS Configuration

The API supports CORS for cross-origin requests:

- **Origin**: `http://localhost:4200` (development)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, x-api-key

## Integration Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  }
});

// Process instruction
async function processInstruction(text, language = 'en') {
  try {
    const response = await apiClient.post('/process-instruction', {
      text,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Error processing instruction:', error.response?.data);
    throw error;
  }
}

// Get available instructions
async function getInstructions() {
  try {
    const response = await apiClient.get('/instructions');
    return response.data;
  } catch (error) {
    console.error('Error getting instructions:', error.response?.data);
    throw error;
  }
}

// Usage
processInstruction('go to home page')
  .then(result => console.log('Result:', result))
  .catch(error => console.error('Error:', error));
```

### Python

```python
import requests

class VoiceAIClient:
    def __init__(self, base_url='http://localhost:3001/api', api_key='your-api-key'):
        self.base_url = base_url
        self.headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key
        }
    
    def process_instruction(self, text, language='en'):
        """Process a natural language instruction."""
        url = f"{self.base_url}/process-instruction"
        data = {
            'text': text,
            'language': language
        }
        
        response = requests.post(url, json=data, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_instructions(self):
        """Get available instructions."""
        url = f"{self.base_url}/instructions"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def health_check(self):
        """Check server health."""
        url = f"{self.base_url}/health"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()

# Usage
client = VoiceAIClient()

try:
    result = client.process_instruction('go to home page')
    print('Result:', result)
except requests.exceptions.RequestException as e:
    print('Error:', e)
```

### cURL Examples

**Process Navigation Instruction:**
```bash
curl -X POST http://localhost:3001/api/process-instruction \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "text": "go to about page",
    "language": "en"
  }'
```

**Get Available Instructions:**
```bash
curl -X GET http://localhost:3001/api/instructions \
  -H "x-api-key: your-api-key"
```

**Health Check:**
```bash
curl -X GET http://localhost:3001/api/health
```

## Swagger Documentation

Interactive API documentation is available at:

- **Development**: `http://localhost:3001/api-docs`
- **Production**: `https://api.voice-ai-app.com/api-docs`

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema documentation
- Authentication setup
- Try-it-out functionality

## Testing

### Test the API

1. **Start the server:**
   ```bash
   cd voice-ai-app/server
   npm start
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3001/api/health
   ```

3. **Test instruction processing:**
   ```bash
   curl -X POST http://localhost:3001/api/process-instruction \
     -H "Content-Type: application/json" \
     -d '{"text": "go to home", "language": "en"}'
   ```

4. **View Swagger documentation:**
   Open `http://localhost:3001/api-docs` in your browser

## Configuration

The API can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | CORS origin | http://localhost:4200 |
| `GOOGLE_CLOUD_PROJECT` | Google Cloud project ID | gen-lang-client-0695988883 |
| `GOOGLE_CLOUD_LOCATION` | Google Cloud location | us-central1 |
| `VERTEX_AI_MODEL` | Vertex AI model | gemini-2.0-flash-001 |

## Security Considerations

1. **API Key Authentication**: Always use API keys in production
2. **Rate Limiting**: Respect rate limits to avoid being blocked
3. **Input Validation**: The API validates and sanitizes all input
4. **HTTPS**: Use HTTPS in production for secure communication
5. **CORS**: Configure CORS appropriately for your domain

## Support

For API support and questions:

- **Email**: support@voice-ai-app.com
- **Documentation**: `/api-docs` endpoint
- **Health Check**: `/api/health` endpoint

## Version History

- **v1.0.0**: Initial release with basic instruction processing
- **v1.1.0**: Added multi-language support
- **v1.2.0**: Added comprehensive Swagger documentation 