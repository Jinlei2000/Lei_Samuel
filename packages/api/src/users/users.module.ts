import { Module, forwardRef } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { LocationsModule } from 'src/locations/locations.module'
import { AbsencesModule } from 'src/absences/absences.module'

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    // Use forwardRef to avoid undefined errors
    // Because 2 modules depend on each other
    // https://docs.nestjs.com/fundamentals/circular-dependency
    forwardRef(() => LocationsModule),
    forwardRef(() => AbsencesModule),
  ],

  exports: [UsersService],
})
export class UsersModule {}
