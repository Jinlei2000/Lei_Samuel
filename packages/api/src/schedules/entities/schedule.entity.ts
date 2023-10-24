import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Appointment } from 'src/appointments/entities/appointment.entity'
import { Material } from 'src/materials/entities/material.entity'
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
@ObjectType()
export class Schedule {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectId

  // Resolve field
  @Column()
  appointmentIds: string[]
  @Field(() => [Appointment])
  appointments: Appointment[]

  // Embedded field
  @Column()
  @Field(() => [User])
  employees: User[]

  // Embedded field
  @Column()
  @Field(() => [Material])
  materials: Material[]

  @Column()
  @Field()
  finalDate: Date

  @Column()
  @Field()
  createdBy: string

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  updatedAt?: Date
}
