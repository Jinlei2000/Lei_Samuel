import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsResolver } from './materials.resolver';

@Module({
  providers: [MaterialsResolver, MaterialsService],
})
export class MaterialsModule {}
