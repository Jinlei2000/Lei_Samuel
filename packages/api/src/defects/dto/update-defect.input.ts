import { ObjectId } from 'typeorm'
import { CreateDefectInput } from './create-defect.input'
import { InputType, Field, PartialType, ID } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { Material } from 'src/materials/entities/material.entity'

@InputType()
export class UpdateDefectInput extends PartialType(CreateDefectInput) {
  @Field(() => ID) // GraphQL type
  id: ObjectId

  @IsOptional() //validation
  @Field({ nullable: true }) // graphql
  description?: string

  @IsOptional() //validation
  @Field(() => Material) // graphql
  material?: Material

  @IsOptional()
  @Field({ nullable: true }) // GraphQL type
  personId?: string

  @IsOptional() //validation
  @Field({ nullable: true}) // graphql
  status?: string
}