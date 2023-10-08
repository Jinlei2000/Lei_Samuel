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
  name: string

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isAvailable: boolean

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  personId: string

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isDefect: boolean

  // TODO: add validation for isDefect
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  serialNumber: number
}
