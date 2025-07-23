// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.info('MongoDB connected');
};

module.exports = connectDB;
