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

let mongoClient;

async function getMongoClient() {
  if (!mongoClient) {
    // If running on Docker with port mapping, localhost:27017 works. Otherwise, use the container IP (e.g., 172.17.0.2)
    mongoClient = new MongoClient(MONGO_URI); // Removed deprecated useUnifiedTopology
    await mongoClient.connect();
  }
  return mongoClient;
}

// GET /databases: List all databases
app.get('/databases', async (req, res) => {
  try {
    const client = await getMongoClient();
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    res.json(dbs.databases.map(db => db.name));
  } catch (err) {
    console.error('Error listing databases:', err);
    res.status(500).json({ error: 'Failed to list databases' });
  }
});

// GET /collections/:db: List collections in a given database
app.get('/collections/:db', async (req, res) => {
  const dbName = req.params.db;
  try {
    const client = await getMongoClient();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    res.json(collections.map(col => col.name));
  } catch (err) {
    console.error(`Error listing collections for db ${dbName}:`, err);
    res.status(500).json({ error: 'Failed to list collections' });
  }
});

// GET /documents/:db/:col: Return sample documents (first 10)
app.get('/documents/:db/:col', async (req, res) => {
  const dbName = req.params.db;
  const colName = req.params.col;
  try {
    const client = await getMongoClient();
    const db = client.db(dbName);
    const collection = db.collection(colName);
    const docs = await collection.find({}).limit(10).toArray();
    res.json(docs);
  } catch (err) {
    console.error(`Error fetching documents for ${dbName}.${colName}:`, err);
    res.status(500).json({ error: 'Failed to fetch documents' });
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