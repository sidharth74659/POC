const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  formId: {
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
  fields: {
    type: [{
      name: { type: String, required: true },
      type: { type: String, required: true },
      required: { type: Boolean, default: false },
      options: { type: [String], default: [] }
    }],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: {
    type: String,
    required: true
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

formSchema.index({ tenantId: 1, formId: 1 });
formSchema.index({ tenantId: 1, status: 1 });

formSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Form', formSchema);

