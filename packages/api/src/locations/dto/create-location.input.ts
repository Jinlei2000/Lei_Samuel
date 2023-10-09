import { InputType, Int, Field } from '@nestjs/graphql'

@InputType()
export class CreateLocationInput {
  @Field() // graphql
  address: string
}
