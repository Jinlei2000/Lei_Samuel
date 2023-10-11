import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}

@Entity()
@ObjectType({ description: 'User' })
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  @Column()
  @Field({ nullable: true })
  uid?: string

  @Column()
  @Field({ description: 'Language code', nullable: true })
  locale?: string

  @Column()
  @Field(() => String)
  role: Role

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
  @Field({ nullable: true, description: 'Profile picture url' }) // GraphQL type
  url?: string

  //TODO: use resolve field for this
  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  locationId?: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  email: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  telephone?: string

  @Column() // Database link - Typeorm
  @Field({ description: 'Is the user available for appointments?' }) // GraphQL type
  availability: boolean

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date

  // STAFF ONLY
  @Column() // Database link - Typeorm
  @Field({
    defaultValue: 0,
    description: 'Number of times the user was absent',
  }) // GraphQL type
  absentCount: number

  // CLIENT ONLY
  @Column() // Database link - Typeorm
  @Field({ defaultValue: 'post', description: 'Invoice option mail or post' }) // GraphQL type
  invoiceOption: string // post or email

  @Column() // Database link - Typeorm
  @Field({ defaultValue: false }) // GraphQL type
  company: boolean

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  btwNumber?: string
}
