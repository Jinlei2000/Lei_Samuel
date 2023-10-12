import { Injectable } from '@nestjs/common'
import { CreateLocationInput } from './dto/create-location.input'
import { UpdateLocationInput } from './dto/update-location.input'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'
import { Location } from './entities/location.entity'

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  //TODO: Resolve fields gebruiken voor personId
  // Can later show all locations of users in the frontend

  findAll(): Promise<Location[]> {
    return this.locationRepository.find()
  }

  findAllByPersonId(personId: string): Promise<Location[]> {
    const locations = this.locationRepository.find({
      where: { personId: personId },
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

  create(createLocationInput: CreateLocationInput): Promise<Location> {
    const l = new Location()
    l.address = createLocationInput.address
    l.personId = createLocationInput.personId

    return this.locationRepository.save(l)
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
  // TODO: Remove unused saveAll function
  saveAll(locations: Location[]): Promise<Location[]> {
    return this.locationRepository.save(locations)
  }

  truncate(): Promise<void> {
    return this.locationRepository.clear()
  }
}
