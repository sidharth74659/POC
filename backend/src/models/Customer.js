const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for tenant isolation and customer lookup
customerSchema.index({ tenantId: 1, customerId: 1 }, { unique: true });
customerSchema.index({ tenantId: 1, 'contact.email': 1 });

// Update the updatedAt field on save
customerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Customer', customerSchema);
