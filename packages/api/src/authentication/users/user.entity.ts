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
  @Field()
  uid: string

  @Column()
  @Field()
  locale?: string

  @Column({ default: Role.CLIENT })
  @Field(() => String)
  role: Role

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @Column({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
