/**
 * MongoDB Viewer Backend
 *
 * To use this backend, you must provide a MongoDB URI for a user with read-only permissions.
 *
 * How to create a read-only MongoDB user (example):
 * 1. Connect to your MongoDB instance as an admin user.
 * 2. Run the following in the Mongo shell:
 *    use admin
 *    db.createUser({
 *      user: "readonly",
 *      pwd: "readonly",
 *      roles: [ { role: "readAnyDatabase", db: "admin" } ]
 *    })
 * 3. Use the URI: mongodb://readonly:readonly@localhost:27017/?authSource=admin
 */

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Store active connections
const connections = new Map();

// POST /connect: Validate and store MongoDB connection
app.post('/connect', async (req, res) => {
  const { uri } = req.body;
  
  if (!uri) {
    return res.status(400).json({ success: false, message: 'MongoDB URI is required' });
  }

  try {
    // Validate URI format
    const mongoRegex = /^mongodb(\+srv)?:\/\/([\w\-\.]+(:[\w\-\.]+)?@)?([\w\-\.]+)(:\d+)?(\/[\w\-\.]*)?(\?[\w\-\.\=\&]*)?$/;
    if (!mongoRegex.test(uri)) {
      return res.status(400).json({ success: false, message: 'Invalid MongoDB URI format' });
    }

    // Test connection
    const client = new MongoClient(uri);
    await client.connect();
    
    // Test if we can list databases (this requires proper permissions)
    const adminDb = client.db().admin();
    await adminDb.listDatabases();
    
    // Store connection with a unique ID
    const connectionId = Date.now().toString();
    connections.set(connectionId, client);
    
    res.json({ 
      success: true, 
      message: 'Connection successful',
      connectionId 
    });
  } catch (err) {
    console.error('Connection error:', err);
    res.status(500).json({ 
      success: false, 
      message: `Connection failed: ${err.message}` 
    });
  }
});

// Helper function to get client by connection ID
async function getClient(connectionId) {
  const client = connections.get(connectionId);
  if (!client) {
    throw new Error('Connection not found');
  }
  return client;
}

// GET /databases: List all databases
app.get('/databases/:connectionId', async (req, res) => {
  const { connectionId } = req.params;
  
  try {
    const client = await getClient(connectionId);
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    res.json(dbs.databases.map(db => db.name));
  } catch (err) {
    console.error('Error listing databases:', err);
    res.status(500).json({ error: 'Failed to list databases' });
  }
});

// GET /collections/:connectionId/:db: List collections in a given database
app.get('/collections/:connectionId/:db', async (req, res) => {
  const { connectionId, db: dbName } = req.params;
  
  try {
    const client = await getClient(connectionId);
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    res.json(collections.map(col => col.name));
  } catch (err) {
    console.error(`Error listing collections for db ${dbName}:`, err);
    res.status(500).json({ error: 'Failed to list collections' });
  }
});

// GET /documents/:connectionId/:db/:col: Return sample documents (first 10)
app.get('/documents/:connectionId/:db/:col', async (req, res) => {
  const { connectionId, db: dbName, col: colName } = req.params;
  
  try {
    const client = await getClient(connectionId);
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const docs = await collection.find({}).limit(10).toArray();
    res.json(docs);
  } catch (err) {
    console.error(`Error fetching documents for ${dbName}.${colName}:`, err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// DELETE /connect/:connectionId: Close a connection
app.delete('/connect/:connectionId', async (req, res) => {
  const { connectionId } = req.params;
  
  try {
    const client = connections.get(connectionId);
    if (client) {
      await client.close();
      connections.delete(connectionId);
    }
    res.json({ success: true, message: 'Connection closed' });
  } catch (err) {
    console.error('Error closing connection:', err);
    res.status(500).json({ error: 'Failed to close connection' });
  }
});

// Minimal OpenAPI 3.0 spec for Swagger
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "MongoDB Viewer API",
    version: "1.0.0",
    description: "API documentation for MongoDB Viewer backend."
  },
  servers: [
    { url: "http://localhost:" + PORT }
  ],
  paths: {
    "/connect": {
      post: {
        summary: "Connect to MongoDB",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  uri: { type: "string", description: "MongoDB connection URI" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Connection successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    message: { type: "string" },
                    connectionId: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/databases/{connectionId}": {
      get: {
        summary: "List all databases",
        parameters: [
          {
            name: "connectionId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "A list of database names",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    },
    "/collections/{connectionId}/{db}": {
      get: {
        summary: "List collections in a given database",
        parameters: [
          {
            name: "connectionId",
            in: "path",
            required: true,
            schema: { type: "string" }
          },
          {
            name: "db",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "A list of collection names",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    },
    "/documents/{connectionId}/{db}/{col}": {
      get: {
        summary: "Return sample documents (first 10)",
        parameters: [
          { name: "connectionId", in: "path", required: true, schema: { type: "string" } },
          { name: "db", in: "path", required: true, schema: { type: "string" } },
          { name: "col", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "A list of documents",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object" } }
              }
            }
          }
        }
      }
    }
  }
};

app.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`MongoDB Viewer backend running on port ${PORT}`);
}); 