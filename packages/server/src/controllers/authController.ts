import { Request, Response } from 'express';
import { User } from '@/models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { validateData } from '@vidflow/shared';
import { CreateUserSchema, LoginSchema } from '@vidflow/shared';
import { HttpError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = validateData(CreateUserSchema, req.body);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new HttpError(400, 'User with this email already exists');
    }
    
    // Create new user
    const user = new User(validatedData);
    await user.save();
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });
    
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = validateData(LoginSchema, req.body);
    
    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      throw new HttpError(401, 'Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid credentials');
    }
    
    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
    });
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Login failed' });
    }
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new HttpError(400, 'Refresh token is required');
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Generate new access token
    const accessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
    });
    
    res.json({ accessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid refresh token' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }
    
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get user' });
    }
  }
};
