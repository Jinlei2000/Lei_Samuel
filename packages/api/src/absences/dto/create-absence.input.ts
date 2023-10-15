import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAbsenceInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
