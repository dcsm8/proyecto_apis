import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';

@Resolver(() => RestaurantEntity)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Query(() => [RestaurantEntity])
  async restaurants(): Promise<RestaurantEntity[]> {
    return this.restaurantService.findAll();
  }

  @Query(() => RestaurantEntity)
  async restaurant(@Args('id') id: string): Promise<RestaurantEntity> {
    return this.restaurantService.findOne(id);
  }

  @Mutation(() => RestaurantEntity)
  async createRestaurant(
    @Args('createRestaurantInput') createRestaurantInput: CreateRestaurantDto,
  ): Promise<RestaurantEntity> {
    return this.restaurantService.create(
      createRestaurantInput as RestaurantEntity,
    );
  }

  @Mutation(() => RestaurantEntity)
  async updateRestaurant(
    @Args('id') id: string,
    @Args('updateRestaurantInput') updateRestaurantInput: UpdateRestaurantDto,
  ): Promise<RestaurantEntity> {
    return this.restaurantService.update(
      id,
      updateRestaurantInput as RestaurantEntity,
    );
  }

  @Mutation(() => Boolean)
  async deleteRestaurant(@Args('id') id: string): Promise<boolean> {
    await this.restaurantService.delete(id);
    return true;
  }
}
