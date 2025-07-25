const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  customerId: { type: String, required: true, index: true },
  orderId: { type: String, required: true },
  details: {
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    notes: { type: String },
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound indexes for tenant isolation and customer scoping
orderSchema.index({ tenantId: 1, customerId: 1 });
orderSchema.index({ tenantId: 1, orderId: 1 }, { unique: true });

// Update the updatedAt field on save
orderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
