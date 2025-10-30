import mongoose, { Schema, Document } from 'mongoose';
import { ConnectionType } from '@vidflow/shared';

export interface IConnection extends Document {
  projectId: mongoose.Types.ObjectId;
  fromNodeId: mongoose.Types.ObjectId;
  toNodeId: mongoose.Types.ObjectId;
  fromHandle?: string;
  toHandle?: string;
  type: ConnectionType;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    fromNodeId: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      required: true,
    },
    toNodeId: {
      type: Schema.Types.ObjectId,
      ref: 'Node',
      required: true,
    },
    fromHandle: String,
    toHandle: String,
    type: {
      type: String,
      enum: Object.values(ConnectionType),
      default: ConnectionType.SEQUENTIAL,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ConnectionSchema.index({ projectId: 1 });
ConnectionSchema.index({ fromNodeId: 1 });
ConnectionSchema.index({ toNodeId: 1 });

// Prevent duplicate connections
ConnectionSchema.index({ fromNodeId: 1, toNodeId: 1 }, { unique: true });

export const Connection = mongoose.model<IConnection>('Connection', ConnectionSchema);
