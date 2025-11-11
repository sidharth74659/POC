const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
  workOrderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  assignedTo: {
    type: String
  },
  createdBy: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

workOrderSchema.index({ tenantId: 1, workOrderId: 1 });
workOrderSchema.index({ tenantId: 1, status: 1 });
workOrderSchema.index({ tenantId: 1, assignedTo: 1 });

workOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WorkOrder', workOrderSchema);

