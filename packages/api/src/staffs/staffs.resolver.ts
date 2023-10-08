import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { StaffsService } from './staffs.service'
import { Staff } from './entities/staff.entity'
import { CreateStaffInput } from './dto/create-staff.input'
import { UpdateStaffInput } from './dto/update-staff.input'
import { OrderByInput } from 'src/interfaces/order.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'

@Resolver(() => Staff)
export class StaffsResolver {
  constructor(private readonly staffsService: StaffsService) {}

  // TODO: Use FirebaseGuard everywhere you need to check if the user is authenticated

  @Query(() => [Staff], { name: 'staffs' })
  findAll(
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.staffsService.findAll(filters, order)
  }

  @Query(() => Staff, { name: 'staff', nullable: true })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.staffsService.findOne(id)
  }

  @Query(() => [Staff], { name: 'staffsBySearchString', nullable: true })
  findStaffsBySearchString(@Args('searchString') searchString: string) {
    return this.staffsService.findStaffsBySearchString(searchString)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Staff, { name: 'staffUpgradeToAdmin' })
  upgradeToAdmin(
    @FirebaseUser() currentUser: UserRecord,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.staffsService.upgradeToAdmin(id, currentUser)
  }

  @Mutation(() => Staff)
  createStaff(@Args('createStaffInput') createStaffInput: CreateStaffInput) {
    return this.staffsService.create(createStaffInput)
  }

  @Mutation(() => Staff)
  updateStaff(@Args('updateStaffInput') updateStaffInput: UpdateStaffInput) {
    return this.staffsService.update(updateStaffInput.id, updateStaffInput)
  }

  @Mutation(() => String)
  removeStaff(@Args('id', { type: () => String }) id: string) {
    return this.staffsService.remove(id)
  }
}
