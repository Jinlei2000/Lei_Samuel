import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Absence {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
