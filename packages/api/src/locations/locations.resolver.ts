import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { LocationsService } from './locations.service'
import { Location } from './entities/location.entity'
import { CreateLocationInput } from './dto/create-location.input'
import { UpdateLocationInput } from './dto/update-location.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseGuard } from 'src/authentication/guards/firebase.guard'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @UseGuards(FirebaseGuard)
  @Query(() => [Location], { name: 'locations' })
  findAllByUid(@FirebaseUser() currentUser: UserRecord) {
    console.log(currentUser.uid)
    return this.locationsService.findAllByUid(currentUser.uid)
  }

  @Query(() => Location, { name: 'location' })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.locationsService.findOne(id)
  }

  @UseGuards(FirebaseGuard)
  @Mutation(() => Location)
  createLocation(
    @FirebaseUser() currentUser: UserRecord,
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
  ) {
    return this.locationsService.create(createLocationInput, currentUser.uid)
  }

  @Mutation(() => Location)
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
  ) {
    return this.locationsService.update(
      updateLocationInput.id,
      updateLocationInput,
    )
  }

  @Mutation(() => String)
  removeLocation(@Args('id', { type: () => String }) id: string) {
    return this.locationsService.remove(id)
  }
}
