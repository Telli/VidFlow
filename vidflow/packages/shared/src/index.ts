export type UserPlan = 'free' | 'pro' | 'team' | 'enterprise';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSettings {
  frameRate?: number;
  resolution?: {
    width: number;
    height: number;
  };
  backgroundColor?: string;
}

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  collaboratorIds: string[];
  settings: ProjectSettings;
  createdAt: string;
  updatedAt: string;
}

export type NodeType = 'scene' | 'audio' | 'manim' | 'transition' | 'custom';

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeSettings {
  [key: string]: unknown;
}

export interface EditorNode<TContent = unknown> {
  id: string;
  projectId: string;
  type: NodeType;
  position: NodePosition;
  settings: NodeSettings;
  content?: TContent;
  createdAt: string;
  updatedAt: string;
}

export type ConnectionType = 'default' | 'conditional' | 'audio' | 'video';

export interface Connection {
  id: string;
  projectId: string;
  fromNodeId: string;
  toNodeId: string;
  type: ConnectionType;
  createdAt: string;
  updatedAt: string;
}
