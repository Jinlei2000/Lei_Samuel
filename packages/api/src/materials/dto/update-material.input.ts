import { ObjectId, ObjectIdColumn } from 'typeorm'
import { CreateMaterialInput } from './create-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Field({ nullable: true }) // GraphQL type
  name: string

  @Field({ nullable: true }) // GraphQL type
  isAvailable: boolean

  @Field({ nullable: true }) // GraphQL type
  personId: string

  @Field({ nullable: true }) // GraphQL type
  isDefect: boolean

  @Field({ nullable: true }) // GraphQL type
  serialNumber: number
}
