import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsResolver } from './staffs.resolver';

@Module({
  providers: [StaffsResolver, StaffsService],
})
export class StaffsModule {}
