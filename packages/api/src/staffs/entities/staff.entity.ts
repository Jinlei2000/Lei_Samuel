import { ObjectType, Field, ID } from '@nestjs/graphql'
import { ObjectIdColumn, ObjectId, Column, Entity } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType({ description: 'staff' }) // GraphQL type
export class Staff {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  firstname: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  lastname: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  fullname: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  url?: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  uid?: string

  // TODO: make a new database for locations
  @Column() // Database link - Typeorm
  @Field(() => String, { nullable: true }) // GraphQL type
  locationId?: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  email: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  telephone?: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  availability: boolean

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  absentCount: number

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  isAdmin: boolean

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
