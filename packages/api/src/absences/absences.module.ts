import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesResolver } from './absences.resolver';

@Module({
  providers: [AbsencesResolver, AbsencesService],
})
export class AbsencesModule {}
