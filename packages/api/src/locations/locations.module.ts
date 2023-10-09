import { Module } from '@nestjs/common'
import { LocationsService } from './locations.service'
import { LocationsResolver } from './locations.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  providers: [LocationsResolver, LocationsService],
  imports: [TypeOrmModule.forFeature([Location])],

  exports: [LocationsService],
})
export class LocationsModule {}
