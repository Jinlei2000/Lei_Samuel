import { InputType, Field } from '@nestjs/graphql'
import { IsDataURI, IsDate } from 'class-validator'

@InputType()
export class CreateAbsenceInput {
  @Field({ nullable: true })
  discription?: string

  @Field()
  userId: string

  @Field()
  type: string

  @IsDate() // example: 2021-01-01
  @Field()
  startDate: Date

  @IsDate()
  @Field()
  endDate: Date
}
