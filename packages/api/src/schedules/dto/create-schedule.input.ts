import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateScheduleInput {
  @Field()
  appointmentIds: string[]

  @Field()
  employeeIds: string[]

  @Field()
  materialIds: string[]

  @Field()
  finalDate: Date

  @Field()
  createdBy: string
}
