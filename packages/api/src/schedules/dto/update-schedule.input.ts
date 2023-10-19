import { ObjectId } from 'typeorm'
import { CreateScheduleInput } from './create-schedule.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

@InputType()
export class UpdateScheduleInput extends PartialType(CreateScheduleInput) {
  @Field(() => ID)
  id: ObjectId

  @Field(() => [String], { nullable: true })
  appointmentIds?: string[]

  @Field(() => [String], { nullable: true })
  employeeIds?: string[]

  @Field(() => [String], { nullable: true })
  materialIds?: string[]

  @Field({ nullable: true })
  finalDate?: Date

  @Field({ nullable: true })
  createdBy?: string
}
