const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./src/models/User');

async function testLogin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Create test user
    const email = 'admin@tenantb.com';
    const password = 'TestPass123!';
    const tenantId = 'tenantb';

    // Check if user exists
    let user = await User.findOne({ email, tenantId });
    
    if (!user) {
      // Create user
      const passwordHash = await bcrypt.hash(password, 10);
      user = new User({
        email,
        passwordHash,
        roles: ['admin'],
        tenantId,
      });
      await user.save();
      console.log('Created test user:', email);
    } else {
      console.log('User already exists:', email);
    }

    // Test login
    const testPassword = 'TestPass123!';
    const isValid = await bcrypt.compare(testPassword, user.passwordHash);
    
    if (isValid) {
      console.log('✅ Login test successful');
    } else {
      console.log('❌ Login test failed');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLogin(); 