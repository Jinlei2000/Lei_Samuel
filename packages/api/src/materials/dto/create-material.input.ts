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
  @IsString() //validation
  @IsNotEmpty() //validation
  @Field() // graphql
  name: string

  @IsBoolean() //validation
  @IsOptional() //validation
  @Field({ defaultValue: true }) // graphql
  isAvailable: boolean

  @IsString() //validation
  @IsOptional() //validation
  @Field({ nullable: true }) // graphql
  personId: string

  @IsInt() //validation
  @Field() // graphql
  serialNumber: number
}
