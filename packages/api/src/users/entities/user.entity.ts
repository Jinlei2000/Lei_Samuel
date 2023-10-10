import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

export enum Role {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT',
}

@Entity()
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  @Column()
  @Field({ nullable: true })
  uid?: string

  @Column()
  @Field({ nullable: true })
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
  @Field({ nullable: true }) // GraphQL type
  url?: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  locationId?: string[] //TODO: use resolve field for this

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  email: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  telephone?: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  availability: boolean

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date

  // STAFF ONLY
  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  absentCount: number

  // CLIENT ONLY
  @Column() // Database link - Typeorm
  @Field({ defaultValue: 'post' }) // GraphQL type
  InvoiceOption: string // post or email

  @Column() // Database link - Typeorm
  @Field({ defaultValue: false }) // GraphQL type
  Company: boolean

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  BtwNumber?: string
}
