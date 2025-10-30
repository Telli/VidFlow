import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ProjectDocument extends Document {
  name: string;
  ownerId: Types.ObjectId;
  collaboratorIds: Types.ObjectId[];
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    collaboratorIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

ProjectSchema.index({ ownerId: 1, name: 1 });

export const Project: Model<ProjectDocument> =
  mongoose.models.Project || mongoose.model<ProjectDocument>('Project', ProjectSchema);
