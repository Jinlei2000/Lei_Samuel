import { ObjectType, Field, ID } from '@nestjs/graphql'
import { User } from 'src/users/entities/user.entity'
import {
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm'
import { Location } from 'src/locations/entities/location.entity'

@Entity()
@ObjectType({ description: 'Appointment' })
export class Appointment {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  // Embedded field
  @Column()
  @Field(() => User)
  user: User

  // Embedded field
  @Column()
  @Field(() => Location)
  location: Location

  @Column()
  @Field({ nullable: true })
  price?: number

  @Column()
  @Field({ description: 'The type of appointment (repair, maintenance, etc)' })
  type: string

  @Column()
  @Field()
  startProposedDate: Date

  @Column()
  @Field()
  endProposedDate: Date

  @Column()
  @Field({ nullable: true, description: 'The date when the appointment is' })
  finalDate?: Date

  @Column()
  @Field({
    defaultValue: false,
    description: 'If the appointment is scheduled, it will be true',
  })
  isScheduled: boolean

  @Column()
  @Field({
    defaultValue: false,
    description: 'If the appointment is done, it will be true',
  })
  isDone: boolean

  @Column()
  @Field({ nullable: true })
  description?: string

  @Column()
  @Field()
  priority: boolean

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date
}
