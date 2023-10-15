import { Module } from '@nestjs/common'
import { AbsencesService } from './absences.service'
import { AbsencesResolver } from './absences.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Absence } from './entities/absence.entity'

@Module({
  providers: [AbsencesResolver, AbsencesService],

  imports: [TypeOrmModule.forFeature([Absence])],
  exports: [AbsencesService],
})
export class AbsencesModule {}
