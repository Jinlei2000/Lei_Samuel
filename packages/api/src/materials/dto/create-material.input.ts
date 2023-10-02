import { InputType, Field } from '@nestjs/graphql'

@InputType() // graphql
export class CreateMaterialInput {
  @Field() // graphql
  name: string

  @Field({ defaultValue: true }) // graphql
  isAvailable: boolean

  @Field({ nullable: true }) // graphql
  personId: string

  @Field() // graphql
  serialNumber: number
}
