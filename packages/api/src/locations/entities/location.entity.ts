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
@ObjectType({ description: 'location' }) // GraphQL type
export class Location {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  userId: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  address: string

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
