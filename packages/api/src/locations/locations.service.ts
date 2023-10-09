import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  findAll() {
    return `This action returns all locations`
  }

  findOne(id: number) {
    return `This action returns a #${id} location`
  }

  create(createLocationInput: CreateLocationInput) {
    return 'This action adds a new location'
  }

  update(id: number, updateLocationInput: UpdateLocationInput) {
    return `This action updates a #${id} location`
  }

  remove(id: number) {
    return `This action removes a #${id} location`
  }
}
