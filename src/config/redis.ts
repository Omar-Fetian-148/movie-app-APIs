import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { config } from "dotenv";
config();

class RedisManager {
  public publisher: Redis;
  public subscriber: Redis;
  private cacheClient: Redis;
  public pubsub: RedisPubSub;

  constructor(
    private REDIS_URL: string = process.env.REDIS_URL as string
  ) {
    this.publisher = new Redis(this.REDIS_URL);
    this.subscriber = new Redis(this.REDIS_URL);
    this.cacheClient = new Redis(this.REDIS_URL);

    this.pubsub = new RedisPubSub({
      publisher: this.publisher,
      subscriber: this.subscriber,
    });

    this.redisErrorHandling();
  }

  private redisErrorHandling() {
    this.subscriber.on('error', this.handleRedisError('Subscriber'));
    this.publisher.on('error', this.handleRedisError('Publisher'));
  }

  private handleRedisError(type: 'Subscriber' | 'Publisher') {
    return (error: Error & { code?: string }) => {
      console.error(`${type} Redis error:`, error);
      if (error instanceof Error && error.code === 'ECONNREFUSED') {
        console.error('Redis connection refused. Check if Redis server is running.');
      }
    };
  }

  public async setCache<T>(key: string, value: T, expiryInSeconds: number): Promise<void> {
    try {
      await this.cacheClient.set(key, JSON.stringify(value), 'EX', expiryInSeconds);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  public async getCache<T>(key: string): Promise<T | null> {
    try {
      const result = await this.cacheClient.get(key);
      return result ? JSON.parse(result) as T : null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  async enqueue<T>(queueName: string, value: T) {
    try {
      await this.cacheClient.rpush(queueName, JSON.stringify(value));
    } catch (error) {
      console.error('Error enqueueing:', error);
    }
  }

  async dequeue<T>(queueName: string): Promise<T | null> {
    try {
      const result = await this.cacheClient.lpop(queueName);
      return result ? JSON.parse(result) as T : null;
    } catch (error) {
      console.error('Error dequeueing:', error);
      return null;
    }
  }
}

const REDIS_URL = process.env.REDIS_URL as string;
const redisManager = new RedisManager(REDIS_URL);

export default redisManager



// const REDIS_URL = process.env.REDIS_URL as string

// // Create Redis clients
// const publisher = new Redis(REDIS_URL);
// const subscriber = new Redis(REDIS_URL);
// const cacheClient = new Redis(REDIS_URL);

// const pubsub = new RedisPubSub({
//   publisher,
//   subscriber,
// });

// // Error handling function
// function handleRedisError(type: 'Subscriber' | 'Publisher') {
//   return (error: Error & { code?: string }) => {
//     console.error(`${type} Redis error:`, error);
//     if (error instanceof Error && error.code === 'ECONNREFUSED') {
//       console.error('Redis connection refused. Check if Redis server is running.');
//     }
//   };
// }

// subscriber.on('error', handleRedisError('Subscriber'));
// publisher.on('error', handleRedisError('Publisher'));

// // Cache helper functions
// async function setCache<T>(key: string, value: T, expiryInSeconds: number) {
//   try {
//     await cacheClient.set(key, JSON.stringify(value), 'EX', expiryInSeconds);
//   } catch (error) {
//     console.error('Error setting cache:', error);
//   }
// }

// async function getCache<T>(key: string): Promise<T | null> {
//   try {
//     const result = await cacheClient.get(key);
//     return result ? JSON.parse(result) as T : null;
//   } catch (error) {
//     console.error('Error getting cache:', error);
//     return null
//   }
// }

// export { publisher, subscriber, pubsub, setCache, getCache };
