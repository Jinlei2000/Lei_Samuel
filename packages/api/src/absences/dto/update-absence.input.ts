import { CreateAbsenceInput } from './create-absence.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAbsenceInput extends PartialType(CreateAbsenceInput) {
  @Field(() => Int)
  id: number;
}
