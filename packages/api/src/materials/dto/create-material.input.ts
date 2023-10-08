import { InputType, Field } from '@nestjs/graphql'
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

@InputType() // graphql
export class CreateMaterialInput {
  @IsNotEmpty() //validation
  @Field() // graphql
  name: string

  @IsOptional() //validation
  @Field({ defaultValue: true }) // graphql
  isAvailable: boolean

  @IsOptional() //validation
  @Field({ nullable: true }) // graphql
  personId: string

  // TODO: add validation for isDefect
  @Field() // graphql
  serialNumber: number
}
