import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { UpdateScheduleInput } from './dto/update-schedule.input';

@Resolver(() => Schedule)
export class SchedulesResolver {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Mutation(() => Schedule)
  createSchedule(@Args('createScheduleInput') createScheduleInput: CreateScheduleInput) {
    return this.schedulesService.create(createScheduleInput);
  }

  @Query(() => [Schedule], { name: 'schedules' })
  findAll() {
    return this.schedulesService.findAll();
  }

  @Query(() => Schedule, { name: 'schedule' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.schedulesService.findOne(id);
  }

  @Mutation(() => Schedule)
  updateSchedule(@Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput) {
    return this.schedulesService.update(updateScheduleInput.id, updateScheduleInput);
  }

  @Mutation(() => Schedule)
  removeSchedule(@Args('id', { type: () => Int }) id: number) {
    return this.schedulesService.remove(id);
  }
}
