import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RestaurantCulinaryCultureService } from './restaurant-culinary-culture.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { AssociateCulinaryCulturesDto } from './restaurant-culinary-culture.dto';

@Resolver(() => RestaurantEntity)
export class RestaurantCulinaryCultureResolver {
  constructor(
    private readonly restaurantCulinaryCultureService: RestaurantCulinaryCultureService,
  ) {}

  @Mutation(() => RestaurantEntity)
  async addCulinaryCultureToRestaurant(
    @Args('restaurantId') restaurantId: string,
    @Args('culinaryCultureId') culinaryCultureId: string,
  ): Promise<RestaurantEntity> {
    return await this.restaurantCulinaryCultureService.addCulinaryCultureToRestaurant(
      restaurantId,
      culinaryCultureId,
    );
  }

  @Query(() => [CulinaryCultureEntity])
  async culinaryCulturesByRestaurantId(
    @Args('restaurantId') restaurantId: string,
  ): Promise<CulinaryCultureEntity[]> {
    return await this.restaurantCulinaryCultureService.findCulinaryCulturesByRestaurantId(
      restaurantId,
    );
  }

  @Query(() => CulinaryCultureEntity)
  async culinaryCultureByRestaurantIdCulinaryCultureId(
    @Args('restaurantId') restaurantId: string,
    @Args('culinaryCultureId') culinaryCultureId: string,
  ): Promise<CulinaryCultureEntity> {
    return await this.restaurantCulinaryCultureService.findCulinaryCultureByRestaurantIdCulinaryCultureId(
      restaurantId,
      culinaryCultureId,
    );
  }

  @Mutation(() => RestaurantEntity)
  async associateCulinaryCulturesRestaurant(
    @Args('restaurantId') restaurantId: string,
    @Args('input') input: AssociateCulinaryCulturesDto,
  ): Promise<RestaurantEntity> {
    const culinaryCultures = input.culinaryCultures.map(
      (id) => ({ id }) as CulinaryCultureEntity,
    );
    return await this.restaurantCulinaryCultureService.associateCulinaryCulturesRestaurant(
      restaurantId,
      culinaryCultures,
    );
  }

  @Mutation(() => Boolean)
  async deleteCulinaryCultureFromRestaurant(
    @Args('restaurantId') restaurantId: string,
    @Args('culinaryCultureId') culinaryCultureId: string,
  ): Promise<boolean> {
    await this.restaurantCulinaryCultureService.deleteCulinaryCultureFromRestaurant(
      restaurantId,
      culinaryCultureId,
    );
    return true;
  }
}
