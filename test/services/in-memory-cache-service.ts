import { CacheService } from '@application/domain/services/CacheService';

export class InMemoryCacheService implements CacheService {
  private cache: Record<string, any> = {};

  async set(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  async get(key: string): Promise<any> {
    const result = this.cache[key];
    if (!result) return undefined;

    return JSON.parse(result);
  }

  async del(key: string): Promise<void> {
    delete this.cache[key];
  }

  async delByPreffix(prefix: string): Promise<void> {
    Object.keys(this.cache)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => delete this.cache[key]);
  }

  async reset(): Promise<void> {
    this.cache = {};
  }
}
