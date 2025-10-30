import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ConnectionDocument extends Document {
  projectId: Types.ObjectId;
  fromNodeId: Types.ObjectId;
  toNodeId: Types.ObjectId;
  type: 'default' | 'conditional' | 'audio' | 'video';
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<ConnectionDocument>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    fromNodeId: { type: Schema.Types.ObjectId, ref: 'EditorNode', required: true, index: true },
    toNodeId: { type: Schema.Types.ObjectId, ref: 'EditorNode', required: true, index: true },
    type: { type: String, required: true, default: 'default' },
  },
  { timestamps: true },
);

ConnectionSchema.index({ projectId: 1, fromNodeId: 1, toNodeId: 1 }, { unique: true });

export const Connection: Model<ConnectionDocument> =
  mongoose.models.Connection ||
  mongoose.model<ConnectionDocument>('Connection', ConnectionSchema);
