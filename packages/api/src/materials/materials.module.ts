import { Module } from '@nestjs/common'
import { MaterialsService } from './materials.service'
import { MaterialsResolver } from './materials.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Material } from './entities/material.entity'

@Module({
  providers: [MaterialsResolver, MaterialsService],
  imports: [TypeOrmModule.forFeature([Material])],

  exports: [MaterialsService],
})
export class MaterialsModule {}
