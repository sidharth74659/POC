const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;
const ASTRA_API_HOST = 'api.langflow.astra.datastax.com';
const ASTRA_API_PATH = '/lf/45d75cd3-e2ad-4d40-8d3d-1cd14342b6eb/api/v1/run/83904f2a-d0a2-4f66-a3ab-fefd3ceda44c';

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Only process POST requests to /proxy endpoint
  if (req.method === 'POST' && req.url === '/proxy') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const { payload, apiKey } = requestData;
        
        if (!payload || !apiKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing payload or API key' }));
          return;
        }

        // Forward the request to Astra API
        const options = {
          hostname: ASTRA_API_HOST,
          path: ASTRA_API_PATH,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        };

        const proxyReq = https.request(options, (proxyRes) => {
          let responseData = '';
          
          proxyRes.on('data', (chunk) => {
            responseData += chunk;
          });
          
          proxyRes.on('end', () => {
            // Forward the status code
            res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' });
            
            // Forward the response data
            res.end(responseData);
          });
        });
        
        proxyReq.on('error', (error) => {
          console.error('Proxy request error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Error forwarding request to API',
            details: error.message
          }));
        });
        
        // Send the payload to the target API
        proxyReq.write(JSON.stringify(payload));
        proxyReq.end();
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid JSON format',
          details: error.message 
        }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Forwarding requests to ${ASTRA_API_HOST}`);
  console.log('\nTo use this proxy:');
  console.log('1. Keep this server running');
  console.log('2. Open index.html in your browser');
  console.log('3. Enter your Astra API key and start chatting');
}); 