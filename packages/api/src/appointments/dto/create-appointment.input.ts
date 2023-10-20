import { InputType, Field } from '@nestjs/graphql'
import { IsDate } from 'class-validator'

@InputType()
export class CreateAppointmentInput {
  @Field()
  userId: string

  @Field()
  locationId: string

  @Field({
    nullable: true,
    description: 'The type of appointment (repair, maintenance, etc)',
  })
  type: string

  @IsDate() // example: 2021-01-01
  @Field()
  startProposedDate: Date

  @IsDate()
  @Field()
  endProposedDate: Date

  @Field({
    defaultValue: false,
    description: 'If the appointment is scheduled, it will be true',
  })
  isScheduled: boolean

  @Field({ nullable: true })
  description?: string

  @Field({
    defaultValue: false,
    description: 'If the appointment is done, it will be true',
  })
  isDone: boolean
}
