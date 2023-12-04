import { ObjectId } from 'typeorm'
import { CreateLocationInput } from './create-location.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

@InputType()
export class UpdateLocationInput extends PartialType(CreateLocationInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Field() // GraphQL type
  title: string

  @Field() // GraphQL type
  address: string

  @Field() // GraphQL type
  lat: number

  @Field() // GraphQL type
  lng: number
}
