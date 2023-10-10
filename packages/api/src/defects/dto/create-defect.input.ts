import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Material } from 'src/materials/entities/material.entity'
import { ObjectId } from 'typeorm'

@InputType() // graphql
export class CreateDefectInput {
  @IsNotEmpty() //validation
  @Field() // graphql
  description: string

  @IsNotEmpty() //validation
  @Field(() => Material) // graphql
  material: Material

  @IsNotEmpty() //validation
  @Field() // graphql
  personId?: string

  // TODO: add validation for isDefect
  @IsNotEmpty() //validation
  @Field({ defaultValue: 'defect' }) // graphql
  status: string
}
