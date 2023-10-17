import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ObjectId } from 'typeorm'

@InputType() // graphql
export class CreateMaterialInput {
  @IsNotEmpty() //validation
  @Field() // graphql
  name: string

  // For future use
  // @IsOptional() //validation
  // @Field({ defaultValue: true }) // graphql
  // isAvailable: boolean

  @IsOptional() //validation
  @Field({ nullable: true }) // graphql
  personId?: string

  @Field({ defaultValue: false }) // graphql
  isLoan: boolean

  // TODO: add validation for isDefect
  @Field() // graphql
  serialNumber: number
}
