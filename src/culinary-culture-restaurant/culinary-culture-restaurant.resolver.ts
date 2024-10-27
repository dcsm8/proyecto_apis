import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CulinaryCultureRestaurantService } from './culinary-culture-restaurant.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Resolver(() => CulinaryCultureEntity)
export class CulinaryCultureRestaurantResolver {
  constructor(
    private culinaryCultureRestaurantService: CulinaryCultureRestaurantService,
  ) {}

  @Query(() => [RestaurantEntity])
  async findRestaurantsByCulinaryCultureId(
    @Args('culinaryCultureId') culinaryCultureId: string,
  ) {
    return this.culinaryCultureRestaurantService.findRestaurantsByCulinaryCultureId(
      culinaryCultureId,
    );
  }

  @Query(() => RestaurantEntity)
  async findRestaurantByCulinaryCultureIdRestaurantId(
    @Args('culinaryCultureId') culinaryCultureId: string,
    @Args('restaurantId') restaurantId: string,
  ) {
    return this.culinaryCultureRestaurantService.findRestaurantByCulinaryCultureIdRestaurantId(
      culinaryCultureId,
      restaurantId,
    );
  }

  @Mutation(() => CulinaryCultureEntity)
  async addRestaurantCulinaryCulture(
    @Args('culinaryCultureId') culinaryCultureId: string,
    @Args('restaurantId') restaurantId: string,
  ) {
    return this.culinaryCultureRestaurantService.addRestaurantToCulinaryCulture(
      culinaryCultureId,
      restaurantId,
    );
  }

  @Mutation(() => CulinaryCultureEntity)
  async associateRestaurantsCulinaryCulture(
    @Args('culinaryCultureId') culinaryCultureId: string,
    @Args('restaurantIds', { type: () => [String] }) restaurantIds: string[],
  ) {
    const restaurants = restaurantIds.map((id) => ({ id }) as RestaurantEntity);
    return this.culinaryCultureRestaurantService.associateRestaurantsCulinaryCulture(
      culinaryCultureId,
      restaurants,
    );
  }

  @Mutation(() => CulinaryCultureEntity)
  async deleteRestaurantCulinaryCulture(
    @Args('culinaryCultureId') culinaryCultureId: string,
    @Args('restaurantId') restaurantId: string,
  ) {
    await this.culinaryCultureRestaurantService.deleteRestaurantFromCulinaryCulture(
      culinaryCultureId,
      restaurantId,
    );
    return this.culinaryCultureRestaurantService.findOne(culinaryCultureId);
  }
}
