import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateAppointmentInput {
  @Field()
  name: string

  @Field()
  date: Date

  @Field()
  location: string

  @Field({ nullable: true })
  description?: string
}
