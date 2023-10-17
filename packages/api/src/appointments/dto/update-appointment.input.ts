import { ObjectId } from 'typeorm'
import { CreateAppointmentInput } from './create-appointment.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

@InputType()
export class UpdateAppointmentInput extends PartialType(
  CreateAppointmentInput,
) {
  @Field(() => ID) 
  id: ObjectId

  @Field(() => Location, { nullable: true })
  location?: Location

  @Field({ nullable: true })
  price?: number

  @Field({
    nullable: true,
    description: 'The type of appointment (repair, maintenance, etc)',
  })
  type?: string

  @Field({ nullable: true })
  startProposedDate?: Date

  @Field({ nullable: true })
  endProposedDate?: Date

  @Field({ nullable: true, description: 'The date when the appointment is' })
  finalDate?: Date

  @Field({
    defaultValue: false,
    nullable: true,
    description: 'If the appointment is scheduled, it will be true',
  })
  isScheduled?: boolean

  @Field({
    defaultValue: false,
    nullable: true,
    description: 'If the appointment is done, it will be true',
  })
  isDone?: boolean
}
