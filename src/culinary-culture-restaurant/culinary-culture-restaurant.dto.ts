import { IsUUID, IsArray } from 'class-validator';

export class AssociateRestaurantsDto {
  @IsArray()
  @IsUUID(undefined, { each: true })
  restaurants: string[];
}

export class CulinaryCultureRestaurantDto {
  @IsUUID()
  culinaryCultureId: string;

  @IsUUID()
  restaurantId: string;
}
