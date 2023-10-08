import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStaffInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
