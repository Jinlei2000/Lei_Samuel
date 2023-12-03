import { CreateFirebaseUserInput } from './create-firebase-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFirebaseUserInput extends PartialType(CreateFirebaseUserInput) {
  @Field(() => Int)
  id: number;
}
