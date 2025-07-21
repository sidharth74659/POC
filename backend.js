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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://readonly:readonly@localhost:27017/?authSource=admin'; // Update as needed

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Helper to get a MongoClient for a given URI (or default)
function getClientForUri(uri) {
  return new MongoClient(uri || MONGO_URI);
}

// GET /databases: List all databases
app.get('/databases', async (req, res) => {
  const uri = req.headers['x-mongo-uri'] || MONGO_URI;
  let client;
  try {
    client = getClientForUri(uri);
    await client.connect();
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    res.json(dbs.databases.map(db => db.name));
  } catch (err) {
    console.error('Error listing databases:', err);
    res.status(500).json({ error: 'Failed to list databases', details: err.message });
  } finally {
    if (client) await client.close();
  }
});

// GET /collections/:db: List collections in a given database
app.get('/collections/:db', async (req, res) => {
  const uri = req.headers['x-mongo-uri'] || MONGO_URI;
  const dbName = req.params.db;
  let client;
  try {
    client = getClientForUri(uri);
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    res.json(collections.map(col => col.name));
  } catch (err) {
    console.error(`Error listing collections for db ${dbName}:`, err);
    res.status(500).json({ error: 'Failed to list collections', details: err.message });
  } finally {
    if (client) await client.close();
  }
});

// GET /documents/:db/:col: Return paginated documents
app.get('/documents/:db/:col', async (req, res) => {
  const uri = req.headers['x-mongo-uri'] || MONGO_URI;
  const dbName = req.params.db;
  const colName = req.params.col;
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 25;
  let client;
  try {
    client = getClientForUri(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const docs = await collection.find({}).skip(skip).limit(limit + 1).toArray();
    const hasMore = docs.length > limit;
    res.json({ data: docs.slice(0, limit), hasMore });
  } catch (err) {
    console.error(`Error fetching documents for ${dbName}.${colName}:`, err);
    res.status(500).json({ data: [], hasMore: false, error: 'Failed to fetch documents', details: err.message });
  } finally {
    if (client) await client.close();
  }
});

// POST /connect: Validate a MongoDB connection URI
app.post('/connect', async (req, res) => {
  const { uri } = req.body;
  if (!uri || typeof uri !== 'string') {
    return res.status(400).json({ success: false, message: 'Missing or invalid URI' });
  }
  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    // Optionally, check permissions/read access
    await client.db().admin().listDatabases();
    res.json({ success: true, message: 'Connected successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Connection failed' });
  } finally {
    if (client) {
      await client.close();
    }
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
    "/databases": {
      get: {
        summary: "List all databases",
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
    "/collections/{db}": {
      get: {
        summary: "List collections in a given database",
        parameters: [
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
    "/documents/{db}/{col}": {
      get: {
        summary: "Return sample documents (first 10)",
        parameters: [
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