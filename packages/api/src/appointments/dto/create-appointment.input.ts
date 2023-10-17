import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateAppointmentInput {
  @Field(() => Location, { nullable: true })
  location: Location

  @Field({
    nullable: true,
    description: 'The type of appointment (repair, maintenance, etc)',
  })
  type: string

  @Field({ nullable: true })
  startProposedDate: Date

  @Field({ nullable: true })
  endProposedDate: Date

  @Field({
    defaultValue: false,
    description: 'If the appointment is scheduled, it will be true',
  })
  isScheduled: boolean

  @Field({
    defaultValue: false,
    description: 'If the appointment is done, it will be true',
  })
  isDone: boolean
}
