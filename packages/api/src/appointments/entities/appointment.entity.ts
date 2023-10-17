import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm'

@Entity()
@ObjectType()
export class Appointment {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  @Column()
  @Field(() => Location)
  location: Location

  @Column()
  @Field()
  price: number

  @Column()
  @Field()
  startProposedDate: Date

  @Column()
  @Field()
  endProposedDate: Date

  @Column()
  @Field()
  finalDate: Date

  @Column()
  @Field()
  isScheduled: boolean

  @Column()
  @Field()
  isDone: boolean

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date
}
