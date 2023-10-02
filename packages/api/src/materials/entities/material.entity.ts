import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType()
export class Material {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // GraphQL type
  id: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  name: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  isAvailable: boolean

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  personId: string

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  isDefect: boolean

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  serialNumber: string

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field() // GraphQL type
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field() // GraphQL type
  updatedAt: Date
}
