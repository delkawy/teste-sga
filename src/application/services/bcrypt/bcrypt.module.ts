import { Module } from '@nestjs/common';
import { BCryptService } from './bcrypt.service';

import { PasswordEncrypter } from '@application/domain/services/PasswordEncrypter';

@Module({
  providers: [
    {
      provide: PasswordEncrypter,
      useClass: BCryptService,
    },
  ],
  exports: [PasswordEncrypter],
})
export class BCryptModule {}
