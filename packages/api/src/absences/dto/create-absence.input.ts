import { InputType, Field } from '@nestjs/graphql'
import { IsDate, IsDateString } from 'class-validator'

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
