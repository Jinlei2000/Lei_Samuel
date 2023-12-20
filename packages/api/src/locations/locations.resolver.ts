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
import { OrderByInput } from 'src/interfaces/order.input'

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Location], { name: 'locations' })
  findAll(
    @Args('order', { type: () => OrderByInput, nullable: true })
    order?: OrderByInput,
  ) {
    return this.locationsService.findAll(order)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => [Location], { name: 'locationsByUserId' })
  findAllByUserId(@Args('userId', { type: () => String }) userId: string) {
    return this.locationsService.findAllByUserId(userId)
  }

  @UseGuards(FirebaseGuard)
  @Query(() => Location, { name: 'location' })
  findOneById(@Args('id', { type: () => String }) id: string) {
    return this.locationsService.findOne(id)
  }

  // search by address
  @AllowedRoles(Role.ADMIN)
  @UseGuards(FirebaseGuard, RolesGuard)
  @Query(() => [Location], { name: 'locationsBySearchString' })
  findLocationsBySearchString(
    @Args('searchString', { type: () => String }) searchString: string,
  ) {
    return this.locationsService.findLocationsBySearchString(searchString)
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
}
