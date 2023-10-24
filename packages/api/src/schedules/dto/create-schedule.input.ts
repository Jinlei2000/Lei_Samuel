import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateScheduleInput {
  @Field(() => [String])
  appointmentIds: string[]

  @Field(() => [String])
  employeeIds: string[]

  @Field(() => [String])
  materialIds: string[]

  @Field()
  finalDate: Date

  @Field()
  createdBy: string
}
