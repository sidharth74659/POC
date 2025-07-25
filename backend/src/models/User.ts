import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  tenantId: string;
  email: string;
  passwordHash: string;
  roles: string[];
}

const userSchema = new Schema<IUser>({
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

export default mongoose.model<IUser>('User', userSchema); 