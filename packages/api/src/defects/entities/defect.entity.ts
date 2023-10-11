import { ObjectType, Field, ID } from '@nestjs/graphql'
import { CreateMaterialInput } from 'src/materials/dto/create-material.input'
import { Material } from 'src/materials/entities/material.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity() // Database link - Typeorm
@ObjectType({ description: 'defect' }) // GraphQL type
export class Defect {
  @ObjectIdColumn() // Database link - Typeorm
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Column() // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  personId?: string

  // description
  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  description: string

  @Column() // Database link - Typeorm
  @Field(() => Material) // GraphQL type
  material: Material

  // status: defect, repaired, discarded
  @Column() // Database link - Typeorm
  @Field() // GraphQL type
  status: string

  @CreateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  createdAt?: Date

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Database link - Typeorm
  @Field({ nullable: true }) // GraphQL type
  updatedAt?: Date
}
