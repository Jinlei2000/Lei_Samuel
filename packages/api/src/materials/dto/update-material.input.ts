import { ObjectId } from 'typeorm'
import { CreateMaterialInput } from './create-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  // TODO: add ? to all fields

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  name?: string

  // For future use
  // @IsOptional()
  // @Field({ nullable: true }) // GraphQL type
  // isAvailable: boolean

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isLoan?: boolean

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  personId?: string

  // For future use
  // @IsOptional()
  // @Field({ nullable: true }) // GraphQL type
  // isDefect: boolean

  // TODO: add validation for serialNumber
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  serialNumber?: number
}
