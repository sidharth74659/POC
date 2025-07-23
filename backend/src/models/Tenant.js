const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subdomain: { type: String, unique: true, required: true },
  dbUri: { type: String, required: true }, // e.g., "mongodb://localhost/tenant1"
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Tenant', tenantSchema);
