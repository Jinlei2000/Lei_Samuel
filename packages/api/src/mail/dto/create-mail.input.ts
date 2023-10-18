import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateMailInput {
  @Field()
  token: string

  @Field()
  userId: string
}
