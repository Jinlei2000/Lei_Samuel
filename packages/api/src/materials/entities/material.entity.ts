import { ObjectType, Field, Int, ID } from '@nestjs/graphql'

@ObjectType()
export class Material {
  @Field(() => ID) // GraphQL type
  id: string

  @Field() // GraphQL type
  name: string

  @Field() // GraphQL type
  isAvailable: boolean

  @Field() // GraphQL type
  personId: string

  @Field() // GraphQL type
  isDefect: boolean

  @Field() // GraphQL type
  serialNumber: string

  @Field() // GraphQL type
  createdAt: Date

  @Field() // GraphQL type
  updatedAt: Date
}
