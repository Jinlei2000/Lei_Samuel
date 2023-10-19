import { Material } from 'src/materials/entities/material.entity'
import { User } from 'src/users/entities/user.entity'
import { ObjectId } from 'typeorm'
import { CreateScheduleInput } from './create-schedule.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { CreateStaffInput } from 'src/users/dto/create-staff.input'
import { CreateMaterialInput } from 'src/materials/dto/create-material.input'

@InputType()
export class UpdateScheduleInput extends PartialType(CreateScheduleInput) {
  @Field(() => ID)
  id: ObjectId

  @Field({ nullable: true })
  appointmentIds?: string[]

  @Field({ nullable: true })
  employeeIds?: string[]

  @Field({ nullable: true })
  materialIds?: string[]

  @Field({ nullable: true })
  finalDate?: Date

  @Field({ nullable: true })
  createdBy?: string
}
