import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateLocationInput {
  @Field() // graphql
  uid: string

  @Field() // graphql
  address: string
}
