import { Module, forwardRef } from '@nestjs/common'
import { MaterialsService } from './materials.service'
import { MaterialsResolver } from './materials.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Material } from './entities/material.entity'
import { UsersModule } from 'src/users/users.module'

@Module({
  providers: [MaterialsResolver, MaterialsService],
  imports: [
    TypeOrmModule.forFeature([Material]),
    forwardRef(() => UsersModule),
  ],

  exports: [MaterialsService],
})
export class MaterialsModule {}
