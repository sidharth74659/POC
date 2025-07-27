import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  tenantId: string;
  customerId: string;
  name: string;
  contact: {
    email: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
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

export default mongoose.model<ICustomer>('Customer', customerSchema);
