import { ObjectId } from 'typeorm'
import { CreateMaterialInput } from './create-material.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  isMongoId,
} from 'class-validator'

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {
  @IsNotEmpty()
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  name: string

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isAvailable: boolean

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  personId: string

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  isDefect: boolean

  @IsInt()
  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  serialNumber: number
}
