import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType({ description: 'material' }) // GraphQL type
export class Material {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  name: string

  // For later use
  // @Column() // Database link - Typeorm
  // @Field() // GraphQL type
  // isAvailable: boolean

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  personId?: string

  // For later use
  // @Column() // Database link - Typeorm
  // @Field() // GraphQL type
  // isDefect: boolean

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  serialNumber: number

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  isLoan: boolean = false

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
