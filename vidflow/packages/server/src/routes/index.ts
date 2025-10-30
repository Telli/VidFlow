import { Router } from 'express';
import projects from './projects';
import nodes from './nodes';
import connections from './connections';
import ai from './ai';
import apikeys from './apikeys';
import jobs from './jobs';

const api = Router();

api.use('/projects', projects);
api.use('/nodes', nodes);
api.use('/connections', connections);
api.use('/ai', ai);
api.use('/apikeys', apikeys);
api.use('/jobs', jobs);

export default api;
