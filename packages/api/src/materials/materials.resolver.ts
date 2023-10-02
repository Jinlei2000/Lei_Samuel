import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { MaterialsService } from './materials.service'
import { Material } from './entities/material.entity'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'

@Resolver(() => Material)
export class MaterialsResolver {
  constructor(private readonly materialsService: MaterialsService) {}

  @Mutation(() => Material)
  createMaterial(
    @Args('createMaterialInput') createMaterialInput: CreateMaterialInput,
  ) {
    return this.materialsService.create(createMaterialInput)
  }

  @Query(() => [Material], { name: 'materials' })
  findAll() {
    return this.materialsService.findAll()
  }

  @Query(() => Material, { name: 'material' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.materialsService.findOne(id)
  }

  @Mutation(() => Material)
  updateMaterial(
    @Args('updateMaterialInput') updateMaterialInput: UpdateMaterialInput,
  ) {
    return this.materialsService.update(
      updateMaterialInput.id,
      updateMaterialInput,
    )
  }

  @Mutation(() => Material)
  removeMaterial(@Args('id', { type: () => Int }) id: number) {
    return this.materialsService.remove(id)
  }
}
