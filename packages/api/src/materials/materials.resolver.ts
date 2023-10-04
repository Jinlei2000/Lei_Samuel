import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { MaterialsService } from './materials.service'
import { Material } from './entities/material.entity'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { GraphQLError } from 'graphql'
import { OrderByInput } from './dto/order.input'

@Resolver(() => Material)
export class MaterialsResolver {
  constructor(private readonly materialsService: MaterialsService) {}

  @UseGuards(FirebaseGuard)
  @Query(() => [Material], { name: 'materials' })
  findAll(@FirebaseUser() currentUser: UserRecord) {
    console.log('currentUser', currentUser)
    return this.materialsService.findAll()
  }

  // find all materials with the same personId
  @Query(() => [Material], { name: 'materialsByPersonId', nullable: true })
  findAllByPersonId(
    @Args('personId', { type: () => String }) personId: string,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ): Promise<Material[]> {
    return this.materialsService.findAllByPersonId(personId, filters, order)
  }

  //nullable: true, because we want to return null if no material is found
  @Query(() => Material, { name: 'material', nullable: true })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.materialsService.findOne(id)
  }

  @Mutation(() => Material, { name: 'createMaterial' })
  createMaterial(
    @Args('createMaterialInput') createMaterialInput: CreateMaterialInput,
  ) {
    return this.materialsService.create(createMaterialInput)
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

  @Mutation(() => String, { name: 'removeMaterial', nullable: true })
  async removeMaterial(@Args('id', { type: () => String }) id: string) {
    return this.materialsService.remove(id)
  }
}
