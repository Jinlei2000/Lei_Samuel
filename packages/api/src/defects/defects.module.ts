import { Module } from '@nestjs/common'
import { DefectsService } from './defects.service'
import { DefectsResolver } from './defects.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Defect } from './entities/defect.entity'

@Module({
  providers: [DefectsResolver, DefectsService],
  imports: [TypeOrmModule.forFeature([Defect])],

  exports: [DefectsService],
})
export class DefectsModule {}
