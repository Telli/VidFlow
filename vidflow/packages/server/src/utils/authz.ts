import { Types } from 'mongoose';
import { Project } from '../models';

export async function userCanAccessProject(userId: string, projectId: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(projectId)) return false;
  const pid = new Types.ObjectId(projectId);
  const uid = new Types.ObjectId(userId);
  const project = await Project.findOne({
    _id: pid,
    $or: [{ ownerId: uid }, { collaboratorIds: uid }],
  }).select('_id ownerId');
  return !!project;
}

export async function userIsProjectOwner(userId: string, projectId: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(projectId)) return false;
  const pid = new Types.ObjectId(projectId);
  const uid = new Types.ObjectId(userId);
  const project = await Project.findOne({ _id: pid, ownerId: uid }).select('_id');
  return !!project;
}
