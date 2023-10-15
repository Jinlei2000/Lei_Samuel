import { Module } from '@nestjs/common'
import { AbsencesService } from './absences.service'
import { AbsencesResolver } from './absences.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Absence } from './entities/absence.entity'
import { UsersModule } from 'src/users/users.module'

@Module({
  providers: [AbsencesResolver, AbsencesService],

  imports: [TypeOrmModule.forFeature([Absence]), UsersModule],
  exports: [AbsencesService],
})
export class AbsencesModule {}
