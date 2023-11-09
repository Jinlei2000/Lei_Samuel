import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateLocationInput {
  @Field() // graphql
  address: string

  @Field() // graphql
  userId: string

  @Field() // graphql
  lat: number

  @Field() // graphql
  lng: number
}
