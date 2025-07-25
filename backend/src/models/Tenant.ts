import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  subdomain: string;
  dbUri: string;
  isActive: boolean;
}

const tenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  subdomain: { type: String, unique: true, required: true },
  dbUri: { type: String, required: true }, // e.g., "mongodb://localhost/tenant1"
  isActive: { type: Boolean, default: true },
});

export default mongoose.model<ITenant>('Tenant', tenantSchema); 