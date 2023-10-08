import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator'

@InputType() // graphql
export class CreateStaffInput {
  @Field() // graphql
  firstname: string

  @Field() // graphql
  lastname: string

  @Field(() => [String], { nullable: true }) // graphql
  locationIds?: string[]

  @IsEmail() // validation
  @IsOptional()
  @Field() // graphql
  email: string

  @IsMobilePhone()
  @IsOptional()
  @Field({ nullable: true }) // graphql
  telephone?: string
}
