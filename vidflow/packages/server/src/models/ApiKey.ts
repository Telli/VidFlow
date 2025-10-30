import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ApiKeyDocument extends Document {
  userId: Types.ObjectId;
  provider: 'openai' | 'anthropic' | 'google' | 'stability' | 'other';
  name: string;
  encryptedKey: string; // AES-256-GCM encrypted
  iv: string;
  authTag: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<ApiKeyDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, required: true },
    name: { type: String, required: true },
    encryptedKey: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
  },
  { timestamps: true },
);

ApiKeySchema.index({ userId: 1, provider: 1, name: 1 }, { unique: true });

export const ApiKey: Model<ApiKeyDocument> =
  mongoose.models.ApiKey || mongoose.model<ApiKeyDocument>('ApiKey', ApiKeySchema);
