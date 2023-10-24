import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { MaterialsService } from './materials.service'
import { Material } from './entities/material.entity'
import { CreateMaterialInput } from './dto/create-material.input'
import { UpdateMaterialInput } from './dto/update-material.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { GraphQLError } from 'graphql'
import { OrderByInput } from '../interfaces/order.input'
import { Role, User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { RolesGuard } from 'src/users/guards/roles.guard'

@Resolver(() => Material)
export class MaterialsResolver {
  constructor(
    private readonly materialsService: MaterialsService,
    private readonly usersService: UsersService,
  ) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Material], { name: 'materials' })
  findAll(
    // @FirebaseUser() currentUser: UserRecord,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
    @Args('searchString', { type: () => String, nullable: true })
    searchString?: string,
  ) {
    return this.materialsService.findAll(filters, order)
  }

  // find all materials with the same userId
  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Material], { name: 'materialsByUserId', nullable: true })
  findAllByUserId(
    @Args('userId', { type: () => String }) userId: string,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ): Promise<Material[]> {
    return this.materialsService.findAllByUserId(userId, filters, order)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Material, { name: 'material', nullable: true }) //nullable: true, because we want to return null if no material is found
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.materialsService.findOne(id)
  }

  // @AllowedRoles(Role.ADMIN, Role.EMPLOYEE)
  // @UseGuards(FirebaseGuard, RolesGuard)
  // @Query(() => [Material], { name: 'materialsBySearchString', nullable: true })
  // findMaterialsBySearchString(@Args('searchString') searchString: string) {
  //   return this.materialsService.findMaterialsBySearchString(searchString)
  // }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Material, { name: 'createMaterial' })
  createMaterial(
    @Args('createMaterialInput') createMaterialInput: CreateMaterialInput,
  ) {
    return this.materialsService.create(createMaterialInput)
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => Material, { name: 'updateMaterial' })
  updateMaterial(
    @Args('updateMaterialInput') updateMaterialInput: UpdateMaterialInput,
  ) {
    return this.materialsService.update(
      updateMaterialInput.id,
      updateMaterialInput,
    )
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String, { name: 'removeMaterial', nullable: true })
  async removeMaterial(@Args('id', { type: () => String }) id: string) {
    return this.materialsService.remove(id)
  }

  // Resolve fields
  @ResolveField()
  user(@Parent() m: Material): Promise<User> {
    if (m.userId) {
      return this.usersService.findOne(m.userId)
    } else {
      return null
    }
  }
}
