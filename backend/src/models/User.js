// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  email: { type: String, required: true, unique: false }, // Unique per tenant, not globally
  passwordHash: { type: String, required: true },
  roles: [
    {
      type: String,
      enum: ['admin', 'agent', 'customer'],
      required: true,
    },
  ],
});

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
