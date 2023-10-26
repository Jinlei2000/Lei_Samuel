import { ObjectId } from 'typeorm'
import { CreateAppointmentInput } from './create-appointment.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { IsDate, IsOptional } from 'class-validator'

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {
  @Field(() => ID)
  id: ObjectId

  @Field({ nullable: true })
  locationId?: string

  @Field({ nullable: true })
  price?: number

  @Field({
    nullable: true,
    description: 'The type of appointment (repair, maintenance, etc)',
  })
  type?: string

  @IsOptional()
  @IsDate() // example: 2021-01-01
  @Field({ nullable: true })
  startProposedDate?: Date

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  endProposedDate?: Date

  @IsOptional()
  @IsDate()
  @Field({ nullable: true, description: 'The date when the appointment is' })
  finalDate?: Date

  @Field({
    defaultValue: false,
    nullable: true,
    description: 'If the appointment is scheduled, it will be true',
  })
  isScheduled?: boolean

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  priority?: boolean

  @Field({
    defaultValue: false,
    nullable: true,
    description: 'If the appointment is done, it will be true',
  })
  isDone?: boolean
}
