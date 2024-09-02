import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';

import { CacheService } from '@application/domain/services/CacheService';
import { redisConstants } from '@configs/redis';

@Injectable()
export class RedisService implements CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: redisConstants.host,
      port: redisConstants.port,
    });
  }

  async set(key: string, value: any): Promise<void> {
    await this.redis.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const result = await this.redis.get(key);

    if (!result) return undefined;

    return JSON.parse(result);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async delByPreffix(preffix: string): Promise<void> {
    const keys = await this.redis.keys(preffix);

    await Promise.all(keys.map((key) => this.redis.del(key)));
  }

  async reset(): Promise<void> {
    await this.redis.reset();
  }
}
