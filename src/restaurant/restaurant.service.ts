import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RestaurantService {
  cacheKey: string = 'restaurantsKey';

  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<RestaurantEntity[]> {
    const cachedRestaurants = await this.cacheManager.get<RestaurantEntity[]>(
      this.cacheKey,
    );

    if (cachedRestaurants) {
      return cachedRestaurants;
    }

    const restaurants = await this.restaurantRepository.find({
      relations: ['culinaryCultures'],
    });

    await this.cacheManager.set(this.cacheKey, restaurants);

    return restaurants;
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return restaurant;
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    const persistedRestaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!persistedRestaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return await this.restaurantRepository.save({
      ...persistedRestaurant,
      ...restaurant,
    });
  }

  async delete(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.restaurantRepository.remove(restaurant);
  }
}
