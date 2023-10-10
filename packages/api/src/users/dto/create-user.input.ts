import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
 @Field(() => String, { nullable: true })
  locale?: string;
}
