import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private isAvailable = false;


  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          return Math.min(retries * 1000, 10000);
        },
      },
    });

    this.client.on('error', (error) => {
      this.isAvailable = false;
      console.error('Redis Client Error:', error);
    });

    this.client.on('ready', () => {
      this.isAvailable = true;
      console.log('Redis is ready');
    });

    try {
      await this.client.connect();

      this.isAvailable = true;

      console.log('Redis connected successfully');
    } catch (error) {
      this.isAvailable = false;
      console.error('Redis connection failed');
    }
  }

  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }

  async get(key: string) {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      this.isAvailable = false;
      console.error(`Redis GET failed for key "${key}"`);
      return null;
    }
  }

  async set(key: string, value: string, expirationInSeconds?: number) {
    if (!this.isAvailable) {
      return null;
    }

    try {
      if (expirationInSeconds) {
        return await this.client.set(key, value, {
          EX: expirationInSeconds,
        });
      }

      return await this.client.set(key, value);
    } catch (error) {
      this.isAvailable = false;
      console.error(`Redis SET failed for key "${key}"`);
      return null;
    }
  }

  async del(key: string) {
    if (!this.isAvailable) {
      return null;
    }

    try {
      return await this.client.del(key);
    } catch (error) {
      this.isAvailable = false;
      console.error(`Redis DEL failed for key "${key}"`);
      return null;
    }
  }

  async delByPattern(pattern: string) {
    if (!this.isAvailable) {
      return;
    }

    try {
      let cursor = '0';

      do {
        const result = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });

        cursor = result.cursor;

        if (result.keys.length > 0) {
          await this.client.del(result.keys);
        }
      } while (cursor !== '0');
    } catch (error) {
      this.isAvailable = false;
      console.error(`Redis DEL BY PATTERN failed for "${pattern}"`);
    }
  }
}
