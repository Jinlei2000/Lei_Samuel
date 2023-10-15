import { ObjectId } from 'typeorm'
import { CreateAbsenceInput } from './create-absence.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'

@InputType()
export class UpdateAbsenceInput extends PartialType(CreateAbsenceInput) {
  @Field(() => ID)
  id: ObjectId

  @Field({ nullable: true })
  discription?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  startDate?: Date

  @Field({ nullable: true })
  endDate?: Date

  @Field(() => [Date], { nullable: true })
  dates?: Date[]

  @Field({ nullable: true })
  totalDays?: number
}
