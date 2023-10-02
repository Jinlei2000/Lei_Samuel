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
  @IsString()
  @IsNotEmpty()
  @Field() // graphql
  name: string

  @IsBoolean()
  @IsOptional()
  @Field({ defaultValue: true }) // graphql
  isAvailable: boolean

  @IsString()
  @IsOptional()
  @Field({ nullable: true }) // graphql
  personId: string

  @IsInt()
  @Field() // graphql
  serialNumber: number
}
