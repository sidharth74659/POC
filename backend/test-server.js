require('dotenv').config();
const express = require('express');
const tenantExtractor = require('./src/middlewares/tenantExtractor');

const app = express();
app.use(express.json());
app.use(tenantExtractor);

// Basic route for testing
app.get('/', (req, res) => {
  console.log('Tenant ID: ' + req.tenantId);
  res.send('Basic Express server with tenant detection is running. Tenant ID: ' + req.tenantId);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
