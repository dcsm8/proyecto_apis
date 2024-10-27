import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CategoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
