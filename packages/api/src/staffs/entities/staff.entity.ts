import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Staff {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
