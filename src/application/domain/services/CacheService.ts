export abstract class CacheService {
  abstract get(key: string): Promise<any>;
  abstract set(key: string, value: any): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract delByPreffix(preffix: string): Promise<void>;
  abstract reset(): Promise<void>;
}
