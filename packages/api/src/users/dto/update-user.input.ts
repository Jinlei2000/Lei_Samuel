import { ObjectId } from 'typeorm'
import { InputType, Field, ID } from '@nestjs/graphql'
import { IsEmail, IsMobilePhone, IsOptional } from 'class-validator'

@InputType()
export class UpdateUserInput {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @Field({ nullable: true }) // graphql
  lastname?: string

  @Field({ nullable: true }) // graphql
  firstname?: string

  @Field({ nullable: true }) // graphql
  url?: string

  @Field({ nullable: true }) // graphql
  uid?: string

  @Field({ nullable: true }) // graphql
  locationId?: string[]

  @IsOptional() // validation
  @IsEmail() // validation
  @Field({ nullable: true }) // graphql
  email?: string

  @IsOptional() // validation
  @IsMobilePhone() // validation
  @Field({ nullable: true }) // graphql
  telephone?: string

  @Field({ nullable: true }) // graphql
  availability?: boolean

  // STAFF ONLY
  @Field({ nullable: true }) // GraphQL type
  absentCount?: number

  // CLIENT ONLY
  @Field({ nullable: true }) // GraphQL type
  InvoiceOption?: string // post or email

  @Field({ nullable: true }) // GraphQL type
  Company?: boolean

  @Field({ nullable: true }) // GraphQL type
  BtwNumber?: string
}
