import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { CreateMaterialInput } from 'src/materials/dto/create-material.input'
import { Material } from 'src/materials/entities/material.entity'
import { ObjectId } from 'typeorm'

@InputType() // graphql
export class CreateDefectInput {
  @IsNotEmpty() //validation
  @Field() // graphql
  description: string

  @IsNotEmpty() //validation
  @Field(() => CreateMaterialInput) // graphql
  material: Material

  @IsNotEmpty() //validation
  @Field() // graphql
  personId?: string

  // TODO: add validation for isDefect
  @IsNotEmpty() //validation
  @Field({ defaultValue: 'defect' }) // graphql
  status: string
}
