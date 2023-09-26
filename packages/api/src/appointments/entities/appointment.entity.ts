import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType() // GraphQL
export class Appointment {
  @ObjectIdColumn() // database link - Typeorm
  @Field(() => ID) // GraphQL
  id: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL
  name: string

  @Column() // Database link - Typeorm
  @Field(() => Date) // GraphQL
  date: Date

  @Column() // Database link - Typeorm
  @Field() // GraphQL
  location: string
}
