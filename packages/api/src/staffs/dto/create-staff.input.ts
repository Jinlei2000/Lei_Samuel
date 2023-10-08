import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsMobilePhone } from 'class-validator'

@InputType() // graphql
export class CreateStaffInput {
  @Field() // graphql
  firstname: string

  @Field() // graphql
  lastname: string

  @Field() // graphql
  fullname: string

  @Field(() => [String], { nullable: true }) // graphql
  locationIds?: string[]

  @IsEmail() // validation
  @Field() // graphql
  email: string

  @IsMobilePhone()
  @Field({ nullable: true }) // graphql
  telephone?: string
}
