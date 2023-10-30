import { InputType, Field } from '@nestjs/graphql'
import { IsEmail } from 'class-validator'

@InputType() // graphql
export class CreateClientInput {
  @Field() // graphql
  uid: string

  @Field() // graphql
  firstname: string

  @Field() // graphql
  lastname: string

  @IsEmail() // validation
  @Field() // graphql
  email: string

  @Field(() => String, { nullable: true }) // graphql
  locale?: string
}
