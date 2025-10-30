import { Response } from 'express';
import { Project } from '@/models/Project';
import { validateData } from '@vidflow/shared';
import { CreateProjectSchema, UpdateProjectSchema } from '@vidflow/shared';
import { HttpError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }
    
    const validatedData = validateData(CreateProjectSchema, req.body);
    
    const project = new Project({
      ...validatedData,
      ownerId: req.user.userId,
      collaborators: [],
    });
    
    await project.save();
    
    res.status(201).json({ project });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to create project' });
    }
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }
    
    const projects = await Project.find({
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId },
      ],
    }).sort({ updatedAt: -1 });
    
    res.json({ projects });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }
    
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId },
      ],
    });
    
    if (!project) {
      throw new HttpError(404, 'Project not found');
    }
    
    res.json({ project });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get project' });
    }
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }
    
    const validatedData = validateData(UpdateProjectSchema, req.body);
    
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { ownerId: req.user.userId },
          { 'collaborators.userId': req.user.userId, 'collaborators.role': { $in: ['admin', 'editor'] } },
        ],
      },
      { $set: validatedData },
      { new: true }
    );
    
    if (!project) {
      throw new HttpError(404, 'Project not found or no permission');
    }
    
    res.json({ project });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to update project' });
    }
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }
    
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.userId,
    });
    
    if (!project) {
      throw new HttpError(404, 'Project not found or no permission');
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
};
