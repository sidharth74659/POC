const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tenantId: { type: String, required: true, index: true },
  // Add other order fields as needed, e.g.:
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
