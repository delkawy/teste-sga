import { Module } from '@nestjs/common';

import { CacheService } from '@application/domain/services/CacheService';
import { RedisService } from './redis/redis.service';

@Module({
  providers: [
    {
      provide: CacheService,
      useClass: RedisService,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
