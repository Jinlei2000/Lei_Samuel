import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsMobilePhone } from 'class-validator'

@InputType() // graphql
export class CreateStaffInput {
  @Field() // graphql
  lastname: string

  @Field() // graphql
  fullname: string

  @Field(() => [String], { nullable: true }) // graphql
  address?: [string]

  @IsEmail() // validation
  @Field() // graphql
  email: string

  @IsMobilePhone()
  @Field({ nullable: true }) // graphql
  telephone?: string

  @Field({ defaultValue: true }) // graphql
  availability: boolean

  @Field({ defaultValue: 0 }) // graphql
  absentCount: number

  @Field({ defaultValue: 'employee' }) // graphql
  staffType: string
}
