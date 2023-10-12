import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateLocationInput {
  @Field() // graphql
  address: string

  @Field() // graphql
  personId: string
}
