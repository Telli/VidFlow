import { Queue, Worker, QueueEvents, type Processor } from 'bullmq';
import { createRedis } from '../redis';

const connection = () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  // bullmq accepts connection string via connection option
  return { connection: { url } } as const;
};

export function createQueue(name: string) {
  const queue = new Queue(name, connection());
  const events = new QueueEvents(name, connection());
  return { queue, events };
}

export function createWorker(name: string, processor: Processor<any, any, string>) {
  const worker = new Worker(name, processor, connection());
  return worker;
}
