import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Location } from 'src/locations/entities/location.entity'

export enum Role {
  // eslint-disable-next-line no-unused-vars
  ADMIN = 'ADMIN',
  // eslint-disable-next-line no-unused-vars
  EMPLOYEE = 'EMPLOYEE',
  // eslint-disable-next-line no-unused-vars
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

  // for resolve field
  @Column() // Database link - Typeorm
  locationIds?: string[]
  @Field(() => [Location], { nullable: 'itemsAndList' }) // GraphQL type
  locations?: Location[]

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  email: string

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  telephone?: string

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
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
