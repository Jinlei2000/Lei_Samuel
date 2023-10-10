import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'src/authentication/users/user.entity'
import { Column, Entity } from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType({ description: 'staff' }) // GraphQL type
export class Staff extends User {
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
}
