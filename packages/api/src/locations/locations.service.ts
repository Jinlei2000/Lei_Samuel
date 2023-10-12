import { Injectable } from '@nestjs/common'
import { CreateLocationInput } from './dto/create-location.input'
import { UpdateLocationInput } from './dto/update-location.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { Location } from './entities/location.entity'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly usersService: UsersService,
  ) {}

  // TODO: filter and order locations
  findAll(): Promise<Location[]> {
    return this.locationRepository.find()
  }

  findAllByUid(uid: string): Promise<Location[]> {
    const locations = this.locationRepository.find({
      where: { uid: uid },
    })

    return locations
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      // @ts-ignore
      _id: new ObjectId(id),
    })

    if (!location) {
      throw new GraphQLError('Location not found!')
    }

    return location
  }

  async create(createLocationInput: CreateLocationInput): Promise<Location> {
    const l = new Location()
    l.address = createLocationInput.address
    l.uid = createLocationInput.uid

    const newLoc = await this.locationRepository.save(l)

    // update user with new location
    const user = await this.usersService.findOneByUid(l.uid)
    const ids = user.locationIds.map(id => id.toString())
    await this.usersService.updateUser(user.uid, user.id, {
      id: user.id,
      locationIds: [...ids, newLoc.id.toString()],
    })

    return newLoc
  }

  async update(
    id: ObjectId,
    updateLocationInput: UpdateLocationInput,
  ): Promise<Location> {
    await this.findOne(id.toString())

    // remove id and make a new variable with the rest of the data
    const { id: _, ...updatedData } = updateLocationInput

    await this.locationRepository.update(id, updatedData)

    return this.findOne(id.toString())
  }

  async remove(id: string): Promise<string> {
    await this.findOne(id)

    await this.locationRepository.delete(id)

    // return id if delete was successful
    return id
  }

  // Seeding functions
  save(location: Location): Promise<Location> {
    return this.locationRepository.save(location)
  }

  truncate(): Promise<void> {
    return this.locationRepository.clear()
  }
}
