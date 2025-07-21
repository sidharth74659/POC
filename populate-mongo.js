// Usage: node populate-mongo.js [mongodb-uri]
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.argv[2] || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('testdb');
    for (let c = 1; c <= 15; c++) {
      const collection = db.collection(`collection${c}`);
      const docs = [];
      for (let d = 1; d <= 50; d++) {
        docs.push({
          name: `Document ${d}`,
          value: Math.random(),
          createdAt: new Date(),
          index: d,
          collection: c,
        });
      }
      await collection.deleteMany({}); // Clean before insert
      await collection.insertMany(docs);
      console.log(`Inserted 50 docs into collection${c}`);
    }
    console.log('Populated testdb with 15 collections, 50 docs each.');
  } catch (err) {
    console.error('Error populating MongoDB:', err);
  } finally {
    await client.close();
  }
}

main(); 