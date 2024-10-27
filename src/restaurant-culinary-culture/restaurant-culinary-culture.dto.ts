import { Field, InputType } from '@nestjs/graphql';
import { IsUUID, IsArray } from 'class-validator';

@InputType()
export class AssociateCulinaryCulturesDto {
  @Field(() => [String])
  @IsArray()
  @IsUUID(undefined, { each: true })
  culinaryCultures: string[];
}

export class RestaurantCulinaryCultureDto {
  @Field()
  @IsUUID()
  restaurantId: string;

  @Field()
  @IsUUID()
  culinaryCultureId: string;
}
