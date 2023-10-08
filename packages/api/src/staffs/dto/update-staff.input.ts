import { ObjectId } from 'typeorm'
import { CreateStaffInput } from './create-staff.input'
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql'
import { IsEmail, IsMobilePhone } from 'class-validator'

@InputType()
export class UpdateStaffInput extends PartialType(CreateStaffInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Field({ nullable: true }) // graphql
  lastname?: string

  @Field({ nullable: true }) // graphql
  fullname?: string

  @Field({ nullable: true }) // graphql
  url?: string

  @Field(() => [String], { nullable: true }) // graphql
  locationIds?: string[]

  @IsEmail() // validation
  @Field({ nullable: true }) // graphql
  email?: string

  @IsMobilePhone() // validation
  @Field({ nullable: true }) // graphql
  telephone?: string

  @Field({ nullable: true }) // graphql
  availability?: boolean

  @Field({ nullable: true }) // GraphQL type
  isAdmin?: boolean
}
