import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { LocationsService } from './locations.service'
import { Location } from './entities/location.entity'
import { CreateLocationInput } from './dto/create-location.input'
import { UpdateLocationInput } from './dto/update-location.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { AllowedRoles } from 'src/users/decorators/role.decorator'
import { Role } from 'src/users/entities/user.entity'
import { RolesGuard } from 'src/users/guards/roles.guard'
import { UserRecord } from 'firebase-admin/auth'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'

@Resolver(() => Location)
export class LocationsResolver {
  constructor(
    private readonly locationsService: LocationsService,
  ) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Location], { name: 'locations' })
  findAll() {
    return this.locationsService.findAll()
  }

  @UseGuards(FirebaseGuard)
  @Query(() => [Location], { name: 'locationsByUid' })
  findAllByUid(
    @Args('uid', { type: () => String }) uid: string,
  ) {
    return this.locationsService.findAllByUid(uid)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Location, { name: 'location' })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.locationsService.findOne(id)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => Location)
  createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
  ) {
    return this.locationsService.create(createLocationInput)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => Location)
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
  ) {
    return this.locationsService.update(
      updateLocationInput.id,
      updateLocationInput,
    )
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => String)
  removeLocation(@Args('id', { type: () => String }) id: string) {
    return this.locationsService.remove(id)
  }

  //TODO: Resolve fields gebruiken voor personId
  // Can later show all locations of users in the frontend
}
