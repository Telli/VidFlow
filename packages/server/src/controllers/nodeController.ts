import { Response } from 'express';
import { Node } from '@/models/Node';
import { Project } from '@/models/Project';
import { validateData } from '@vidflow/shared';
import { CreateNodeSchema, UpdateNodeSchema } from '@vidflow/shared';
import { HttpError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

export const createNode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }

    const validatedData = validateData(CreateNodeSchema, req.body);

    // Verify user has access to project
    const project = await Project.findOne({
      _id: validatedData.projectId,
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId },
      ],
    });

    if (!project) {
      throw new HttpError(404, 'Project not found or no access');
    }

    const node = new Node(validatedData);
    await node.save();

    res.status(201).json({ node });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to create node' });
    }
  }
};

export const getNodesByProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }

    const { projectId } = req.params;

    // Verify user has access to project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId },
      ],
    });

    if (!project) {
      throw new HttpError(404, 'Project not found or no access');
    }

    const nodes = await Node.find({ projectId });

    res.json({ nodes });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to get nodes' });
    }
  }
};

export const updateNode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }

    const validatedData = validateData(UpdateNodeSchema, req.body);
    const { id } = req.params;

    const node = await Node.findById(id);
    if (!node) {
      throw new HttpError(404, 'Node not found');
    }

    // Verify user has access to project
    const project = await Project.findOne({
      _id: node.projectId,
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId, 'collaborators.role': { $in: ['admin', 'editor'] } },
      ],
    });

    if (!project) {
      throw new HttpError(404, 'No permission to edit this node');
    }

    Object.assign(node, validatedData);
    await node.save();

    res.json({ node });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to update node' });
    }
  }
};

export const deleteNode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'Not authenticated');
    }

    const { id } = req.params;

    const node = await Node.findById(id);
    if (!node) {
      throw new HttpError(404, 'Node not found');
    }

    // Verify user has access to project
    const project = await Project.findOne({
      _id: node.projectId,
      $or: [
        { ownerId: req.user.userId },
        { 'collaborators.userId': req.user.userId, 'collaborators.role': { $in: ['admin', 'editor'] } },
      ],
    });

    if (!project) {
      throw new HttpError(404, 'No permission to delete this node');
    }

    await node.deleteOne();

    res.json({ message: 'Node deleted successfully' });
  } catch (error: any) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to delete node' });
    }
  }
};
