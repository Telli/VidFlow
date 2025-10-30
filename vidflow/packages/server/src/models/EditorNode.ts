import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface EditorNodeDocument extends Document {
  projectId: Types.ObjectId;
  type: 'scene' | 'audio' | 'manim' | 'transition' | 'custom';
  position: { x: number; y: number };
  settings: Record<string, unknown>;
  content?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const EditorNodeSchema = new Schema<EditorNodeDocument>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    type: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    settings: { type: Schema.Types.Mixed, default: {} },
    content: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

EditorNodeSchema.index({ projectId: 1 });

export const EditorNode: Model<EditorNodeDocument> =
  mongoose.models.EditorNode ||
  mongoose.model<EditorNodeDocument>('EditorNode', EditorNodeSchema);
