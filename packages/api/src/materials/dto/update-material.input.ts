import { ObjectId } from 'typeorm'
import { CreateMaterialInput } from './create-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Field({ nullable: true }) // GraphQL type
  name?: string

  @Field({ nullable: true }) // GraphQL type
  isLoan?: boolean

  @Field({ nullable: true }) // GraphQL type
  userId?: string

  @Field({ nullable: true }) // GraphQL type
  serialNumber?: number
}
