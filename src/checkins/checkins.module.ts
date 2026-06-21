import { Module } from '@nestjs/common';
import { CheckinsController } from './checkins.controller.js';
import { CheckinsService } from './checkins.service.js';

@Module({
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService],
})
export class CheckinsModule {}
