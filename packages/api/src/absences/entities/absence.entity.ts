import { ObjectType, Field, ID } from '@nestjs/graphql'
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

  @Column()
  @Field({ description: 'person of absence' })
  personId: string

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

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
