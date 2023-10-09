import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { DefectsService } from './defects.service'
import { Defect } from './entities/defect.entity'
import { CreateDefectInput } from './dto/create-defect.input'
import { UpdateDefectInput } from './dto/update-defect.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'
import { GraphQLError } from 'graphql'
import { OrderByInput } from '../interfaces/order.input'

@Resolver(() => Defect)
export class DefectsResolver {
  constructor(private readonly defectsService: DefectsService) {}

  // TODO: Use FirebaseGuard everywhere you need to check if the user is authenticated

  // @UseGuards(FirebaseGuard)
  @Query(() => [Defect], { name: 'defects' })
  findAll(
    // @FirebaseUser() currentUser: UserRecord,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    // console.log('currentUser', currentUser)
    return this.defectsService.findAll(filters, order)
  }

  // find all defects with the same personId
  @Query(() => [Defect], { name: 'defectsByPersonId', nullable: true })
  findAllByPersonId(
    @Args('personId', { type: () => String }) personId: string,
    @Args('filters', { type: () => [String], nullable: true })
    filters?: Array<string>,
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ): Promise<Defect[]> {
    return this.defectsService.findAllByPersonId(personId, filters, order)
  }

  //nullable: true, because we want to return null if no defect is found
  @Query(() => Defect, { name: 'defect', nullable: true })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.defectsService.findOne(id)
  }

  @Query(() => [Defect], { name: 'defectsBySearchString', nullable: true })
  findDefectsBySearchString(@Args('searchString') searchString: string) {
    return this.defectsService.findDefectsBySearchString(searchString)
  }

  @Mutation(() => Defect, { name: 'createDefect' })
  createDefect(
    @Args('createDefectInput') createDefectInput: CreateDefectInput,
  ) {
    return this.defectsService.create(createDefectInput)
  }

  @Mutation(() => Defect, { name: 'updateDefect' })
  updateDefect(
    @Args('updateDefectInput') updateDefectInput: UpdateDefectInput,
  ) {
    return this.defectsService.update(
      updateDefectInput.id,
      updateDefectInput,
    )
  }

  @Mutation(() => String, { name: 'removeDefect', nullable: true })
  async removeDefect(@Args('id', { type: () => String }) id: string) {
    return this.defectsService.remove(id)
  }
}
