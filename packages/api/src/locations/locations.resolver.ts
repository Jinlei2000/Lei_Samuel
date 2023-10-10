import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { LocationsService } from './locations.service'
import { Location } from './entities/location.entity'
import { CreateLocationInput } from './dto/create-location.input'
import { UpdateLocationInput } from './dto/update-location.input'
import { UseGuards } from '@nestjs/common'
import { FirebaseUser } from 'src/authentication/decorators/user.decorator'
import { UserRecord } from 'firebase-admin/auth'

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => [Location], { name: 'locations' })
  findAll() {
    return this.locationsService.findAll()
  }

  @Query(() => Location, { name: 'location' })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.locationsService.findOne(id)
  }

  @UseGuards(FirebaseUser)
  @Mutation(() => Location)
  createLocation(
    @FirebaseUser() currentUser: UserRecord,
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
  ) {
    return this.locationsService.create(createLocationInput, currentUser)
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
