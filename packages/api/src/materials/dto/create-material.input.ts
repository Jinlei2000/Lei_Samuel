import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType() // graphql
export class CreateMaterialInput {
  @IsNotEmpty() //validation
  @Field() // graphql
  name: string

  @IsOptional() //validation
  @Field({ nullable: true }) // graphql
  userId?: string

  @Field({ defaultValue: false }) // graphql
  isLoan: boolean

  // TODO: add validation for isDefect
  @Field() // graphql
  serialNumber: number
}
