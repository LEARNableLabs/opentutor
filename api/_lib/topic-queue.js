import { QueueClient } from '@vercel/queue';

// A fixed region keeps producers and consumers on the same durable topic.
export const topicQueue = new QueueClient({ region: 'iad1' });
export const enqueueTopicBuild = (message) => topicQueue.send('opentutor-curriculum', message, {
  idempotencyKey: `${message.id}:${message.seq}`, retentionSeconds: 604800,
});
