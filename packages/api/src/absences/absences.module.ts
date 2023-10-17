import { Module, forwardRef } from '@nestjs/common'
import { AbsencesService } from './absences.service'
import { AbsencesResolver } from './absences.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Absence } from './entities/absence.entity'
import { UsersModule } from 'src/users/users.module'

@Module({
  providers: [AbsencesResolver, AbsencesService],

  imports: [
    TypeOrmModule.forFeature([Absence]),
    // Use forwardRef to avoid undefined errors
    // Because 2 modules depend on each other
    // https://docs.nestjs.com/fundamentals/circular-dependency
    forwardRef(() => UsersModule),
  ],
  exports: [AbsencesService],
})
export class AbsencesModule {}
