import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
 @Field(() => String)
 uid: string;

 @Field(() => String, { nullable: true })
  locale?: string;
}
