import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Schedule {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
