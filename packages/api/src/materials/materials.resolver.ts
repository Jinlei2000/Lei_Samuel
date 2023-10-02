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

  //nullable: true, because we want to return null if no material is found
  @Query(() => Material, { name: 'material', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.materialsService.findOne(id)
  }

  @Mutation(() => Material, { name: 'updateMaterial' })
  updateMaterial(
    @Args('updateMaterialInput') updateMaterialInput: UpdateMaterialInput,
  ) {
    return this.materialsService.update(
      updateMaterialInput.id,
      updateMaterialInput,
    )
  }

  @Mutation(() => Material, { name: 'removeMaterial', nullable: true })
  removeMaterial(@Args('id', { type: () => String }) id: string) {
    return this.materialsService.remove(id)
  }
}
