import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm'

@Entity()
@ObjectType()
export class Mail {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  @Column()
  @Field()
  token: string

  @Column()
  @Field({ description: 'Expiration date of the token (2 weeks)' })
  expirationDate: Date

  @Column()
  @Field()
  userId: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt?: Date
}
