import { ObjectType, Field, Int, ID } from '@nestjs/graphql'

@ObjectType()
export class Appointment {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field(() => Date)
  date: Date
}
