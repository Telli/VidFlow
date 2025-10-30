import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  collaborators: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'viewer' | 'editor' | 'admin';
  }>;
  settings: {
    videoFormat: string;
    resolution: string;
    fps: number;
    backgroundColor: string;
  };
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['viewer', 'editor', 'admin'],
          default: 'editor',
        },
      },
    ],
    settings: {
      videoFormat: {
        type: String,
        default: 'mp4',
      },
      resolution: {
        type: String,
        default: '1920x1080',
      },
      fps: {
        type: Number,
        default: 30,
      },
      backgroundColor: {
        type: String,
        default: '#000000',
      },
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ 'collaborators.userId': 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
