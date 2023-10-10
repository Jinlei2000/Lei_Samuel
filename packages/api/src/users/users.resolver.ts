import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UsersService } from './users.service'
import { Role, User } from './entities/user.entity'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { RolesGuard } from './guards/roles.guard'
import { AllowedRoles } from './decorators/role.decorator'
import { CreateStaffInput } from './dto/create-staff.input'
import { OrderByInput } from 'src/interfaces/order.input'
import { UpdateUserInput } from './dto/update-user.input'
import { CreateClientInput } from './dto/create-client.input'

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [User], { name: 'users' })
  findAll(
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.usersService.findAll(filters, order)
  }

  // @UseGuards(FirebaseGuard)
  @Query(() => User, { name: 'userByUid' })
  findOneByUid(@Args('uid', { type: () => String }) uid: string) {
    return this.usersService.findOneByUid(uid)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id)
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [User], { name: 'usersBySearchString' })
  findUsersBySearchString(
    @Args('searchString', { type: () => String }) searchString: string,
  ) {
    return this.usersService.findUsersBySearchString(searchString)
  }

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => User, { name: 'userUpgradeToAdmin' })
  upgradeToAdmin(@Args('id', { type: () => String }) id: string) {
    return this.usersService.upgradeToAdmin(id)
  }

  @AllowedRoles(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => User, { name: 'updateUser' })
  update(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @FirebaseUser() currentUser: UserRecord,
  ) {
    return this.usersService.updateUser(
      currentUser.uid,
      updateUserInput.id,
      updateUserInput,
    )
  }

  @AllowedRoles(Role.ADMIN, Role.CLIENT)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => String, { name: 'removeUser' })
  removeUser(
    @Args('id', { type: () => String }) id: string,
    @FirebaseUser() currentUser: UserRecord,
  ) {
    return this.usersService.removeUser(currentUser.uid, id)
  }

  //#region Staff
  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Mutation(() => User, { name: 'createStaff' })
  createStaff(
    @Args('createStaffInput') createStaffInput: CreateStaffInput,
    @FirebaseUser() currentUser: UserRecord,
  ) {
    return this.usersService.createStaff(currentUser.uid, createStaffInput)
  }
  //#endregion

  //#region Client
  // FIXME: WHY WE USE HERE FIREBASEGUARD? USER IS NOT LOGGED IN YET?
  @UseGuards(FirebaseGuard)
  @Mutation(() => User, { name: 'createClient' })
  createClient(
    @Args('createClientInput') createClientInput: CreateClientInput,
    @FirebaseUser() currentUser: UserRecord,
  ) {
    return this.usersService.createClient(currentUser.uid, createClientInput)
  }
  //#endregion
}
