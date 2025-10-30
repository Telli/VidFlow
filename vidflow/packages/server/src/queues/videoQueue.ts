import { createQueue, createWorker } from './index';

export const VIDEO_QUEUE_NAME = 'video-generation';

export const { queue: videoQueue, events: videoQueueEvents } = createQueue(VIDEO_QUEUE_NAME);

export function startVideoWorker() {
  createWorker(VIDEO_QUEUE_NAME, async (job) => {
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 50));
      await job.updateProgress(i);
    }
    return { status: 'completed', outputUrl: `https://example.com/video/${job.id}.mp4` };
  });
}
