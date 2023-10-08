import { InputType, Field } from "@nestjs/graphql"

@InputType()
export class OrderByInput {
  @Field(() => String)
  field: string

  @Field(() => String)
  direction: string
}
