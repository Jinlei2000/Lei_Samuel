import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType({ description: 'location' }) // GraphQL type
export class Location {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  address: string
}
