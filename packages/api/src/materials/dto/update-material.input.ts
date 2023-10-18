import { ObjectId } from 'typeorm'
import { CreateMaterialInput } from './create-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  name?: string

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isLoan?: boolean

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  userId?: string

  // TODO: add validation for serialNumber
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  serialNumber?: number
}
