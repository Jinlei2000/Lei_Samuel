import { ObjectType, Field, Int, ID } from '@nestjs/graphql'
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
  @Field() // GraphQL type
  uid: string

  @Column() // Database link - Typeorm
  @Field(() => [Location], { nullable: true }) // GraphQL type
  address?: Location[]

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  email: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  telephone?: string

  @Column() // Database link - Typeorm
  @Field({ defaultValue: true }) // GraphQL type
  availability: boolean

  @Column() // Database link - Typeorm
  @Field({ defaultValue: 0 }) // GraphQL type
  absentCount: number

  @Column() // Database link - Typeorm
  @Field({ defaultValue: 'employee' }) // GraphQL type
  staffType: string

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
