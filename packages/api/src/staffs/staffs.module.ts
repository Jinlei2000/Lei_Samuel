import { Module } from '@nestjs/common'
import { StaffsService } from './staffs.service'
import { StaffsResolver } from './staffs.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Staff } from './entities/staff.entity'

@Module({
  providers: [StaffsResolver, StaffsService],
  imports: [TypeOrmModule.forFeature([Staff])],

  exports: [StaffsService],
})
export class StaffsModule {}
