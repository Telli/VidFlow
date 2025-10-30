import mongoose, { Schema, Document } from 'mongoose';
import { NodeType, AIProvider } from '@vidflow/shared';

export interface INode extends Document {
  projectId: mongoose.Types.ObjectId;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  settings?: {
    provider?: AIProvider;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    useCustomApiKey?: boolean;
  };
  content?: {
    prompt?: string;
    response?: string;
    mediaUrl?: string;
    duration?: number;
    status: 'idle' | 'processing' | 'completed' | 'error';
    error?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NodeSchema = new Schema<INode>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NodeType),
      required: true,
    },
    position: {
      x: {
        type: Number,
        required: true,
        default: 0,
      },
      y: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    settings: {
      provider: {
        type: String,
        enum: Object.values(AIProvider),
      },
      model: String,
      temperature: {
        type: Number,
        min: 0,
        max: 2,
      },
      maxTokens: Number,
      systemPrompt: String,
      useCustomApiKey: Boolean,
    },
    content: {
      prompt: String,
      response: String,
      mediaUrl: String,
      duration: Number,
      status: {
        type: String,
        enum: ['idle', 'processing', 'completed', 'error'],
        default: 'idle',
      },
      error: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
NodeSchema.index({ projectId: 1 });

export const Node = mongoose.model<INode>('Node', NodeSchema);
