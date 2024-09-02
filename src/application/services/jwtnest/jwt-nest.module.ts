import { Module } from '@nestjs/common';

import { JwtService } from '@application/domain/services/JwtService';
import { JwtNestService } from './jwt-nest.service';

@Module({
  providers: [
    {
      provide: JwtService,
      useClass: JwtNestService,
    },
  ],
  exports: [JwtService],
})
export class JwtNestModule {}
