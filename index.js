const http = require('http');
const url = require('url');
const https = require('https');

const PORT = process.env.PORT || 3000;

// DataStax Astra API configuration
const ASTRA_API_URL = 'api.langflow.astra.datastax.com';
const ASTRA_API_PATH = '/lf/45d75cd3-e2ad-4d40-8d3d-1cd14342b6eb/api/v1/run/83904f2a-d0a2-4f66-a3ab-fefd3ceda44c';

// Helper function to make requests to DataStax Astra API
function queryAstraAPI(question, sessionId, apiKey) {
  return new Promise((resolve, reject) => {
    const payload = {
      "input_value": question,
      "output_type": "chat",
      "input_type": "chat",
      "session_id": sessionId || `session_${Date.now()}`
    };

    const options = {
      hostname: ASTRA_API_URL,
      path: ASTRA_API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } else {
            reject(new Error(`API call failed with status code ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Error making API request: ${error.message}`));
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Add a simple health check endpoint
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Only handle POST requests to /ask
  if (req.method === 'POST' && req.url === '/ask') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { question, sessionId, apiKey } = JSON.parse(body);
        
        if (!question) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing question field' }));
          return;
        }

        if (!apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing API key' }));
          return;
        }

        // Query DataStax Astra API with the question and API key
        queryAstraAPI(question, sessionId, apiKey)
          .then(apiResponse => {
            // Extract the answer from the API response
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              Response: apiResponse.outputs?.[0]?.outputs?.[0]?.artifacts?.message || 'No response from Astra API'
            }));
          })
          .catch(error => {
            console.error('API Error:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'Error querying knowledge base',
              details: error.message
            }));
          });
      } catch (error) {
        console.error('Request processing error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });
  } else if (req.url !== '/health') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('To test the chatbot:');
  console.log('1. Open index.html in your browser');
  console.log('2. Enter your Astra API key in the input field');
  console.log('3. Type a question and press send or hit Enter');
}); 