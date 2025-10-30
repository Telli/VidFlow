import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserPlan } from '@vidflow/shared';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  plan: UserPlan;
  apiKeys?: {
    openai?: string;
    anthropic?: string;
    google?: string;
    stabilityai?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    plan: {
      type: String,
      enum: Object.values(UserPlan),
      default: UserPlan.FREE,
    },
    apiKeys: {
      openai: { type: String, select: false },
      anthropic: { type: String, select: false },
      google: { type: String, select: false },
      stabilityai: { type: String, select: false },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

export const User = mongoose.model<IUser>('User', UserSchema);
