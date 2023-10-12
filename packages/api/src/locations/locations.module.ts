import { Module } from '@nestjs/common'
import { Location } from './entities/location.entity'
import { LocationsService } from './locations.service'
import { LocationsResolver } from './locations.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'

@Module({
  providers: [LocationsResolver, LocationsService],
  imports: [TypeOrmModule.forFeature([Location]), UsersModule],

  exports: [LocationsService],
})
export class LocationsModule {}
