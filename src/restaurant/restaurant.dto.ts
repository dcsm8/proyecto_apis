import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsDate,
  IsUUID,
} from 'class-validator';

@InputType()
export class CreateRestaurantDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  country: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  michelinStars?: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  michelinStarDate?: Date;
}

@InputType()
export class UpdateRestaurantDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  country?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  michelinStars?: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  michelinStarDate?: Date;
}

@InputType()
export class RestaurantDto {
  @Field()
  @IsUUID()
  id: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  city: string;

  @Field()
  @IsString()
  country: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  michelinStars?: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  michelinStarDate?: Date;

  @Field(() => [String], { nullable: true })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  culinaryCultureIds?: string[];
}
