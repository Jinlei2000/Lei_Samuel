import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
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

  // Resolve field
  @Column() // Database link - Typeorm
  userId?: string
  @Field(() => User, { nullable: true, description: 'material owner' }) // GraphQL type
  user?: User

  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  serialNumber: number

  @Column() // Database link - Typeorm
  @Field({ description: 'material loanable or not' }) // GraphQL type
  isLoan: boolean

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
