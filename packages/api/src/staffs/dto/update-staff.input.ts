import { CreateStaffInput } from './create-staff.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStaffInput extends PartialType(CreateStaffInput) {
  @Field(() => Int)
  id: number;
}
