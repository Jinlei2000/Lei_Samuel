import { ObjectId } from 'typeorm'
import { CreateMaterialInput } from './create-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @IsNotEmpty()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  name: string

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isAvailable: boolean

  @IsNotEmpty()
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
