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

@Entity()
@ObjectType({ description: 'Absence' })
export class Absence {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  // for resolve field
  @Column()
  userId: string
  @Field(() => User, { description: 'person of absence' })
  user: User

  @Column()
  @Field({ nullable: true })
  discription?: string

  @Column()
  @Field({ description: 'Type of absence (sick, vacation, other)' })
  type: string // sick, vacation, other

  @Column()
  @Field({ description: 'Start date of absence' })
  startDate: Date

  @Column()
  @Field({ description: 'End date of absence' })
  endDate: Date

  @Column()
  @Field({ description: 'Total days of absence' })
  totalDays: number

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
