import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CulinaryCultureRestaurantService {
  constructor(
    @InjectRepository(CulinaryCultureEntity)
    private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addRestaurantToCulinaryCulture(
    culinaryCultureId: string,
    restaurantId: string,
  ): Promise<CulinaryCultureEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id: culinaryCultureId },
      relations: ['restaurants'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    culinaryCulture.restaurants = [...culinaryCulture.restaurants, restaurant];
    return await this.culinaryCultureRepository.save(culinaryCulture);
  }

  async findRestaurantsByCulinaryCultureId(
    culinaryCultureId: string,
  ): Promise<RestaurantEntity[]> {
    const cacheKey = `culinaryCulture_${culinaryCultureId}_restaurants`;
    const cachedRestaurants =
      await this.cacheManager.get<RestaurantEntity[]>(cacheKey);

    if (cachedRestaurants) {
      return cachedRestaurants;
    }

    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id: culinaryCultureId },
      relations: ['restaurants'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const restaurants = culinaryCulture.restaurants;
    await this.cacheManager.set(cacheKey, restaurants);

    return restaurants;
  }

  async findRestaurantByCulinaryCultureIdRestaurantId(
    culinaryCultureId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id: culinaryCultureId },
      relations: ['restaurants'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const restaurant = culinaryCulture.restaurants.find(
      (r) => r.id === restaurantId,
    );
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the culinary culture',
        BusinessError.PRECONDITION_FAILED,
      );

    return restaurant;
  }

  async associateRestaurantsCulinaryCulture(
    culinaryCultureId: string,
    restaurants: RestaurantEntity[],
  ): Promise<CulinaryCultureEntity> {
    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id: culinaryCultureId },
      relations: ['restaurants'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (const restaurantData of restaurants) {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurantData.id },
      });
      if (!restaurant)
        throw new BusinessLogicException(
          'The restaurant with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    culinaryCulture.restaurants = restaurants;
    return await this.culinaryCultureRepository.save(culinaryCulture);
  }

  async deleteRestaurantFromCulinaryCulture(
    culinaryCultureId: string,
    restaurantId: string,
  ) {
    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id: culinaryCultureId },
      relations: ['restaurants'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const restaurant = culinaryCulture.restaurants.find(
      (r) => r.id === restaurantId,
    );
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the culinary culture',
        BusinessError.PRECONDITION_FAILED,
      );

    culinaryCulture.restaurants = culinaryCulture.restaurants.filter(
      (r) => r.id !== restaurantId,
    );
    await this.culinaryCultureRepository.save(culinaryCulture);
  }

  async findCulinaryCulturesByRestaurantId(
    restaurantId: string,
  ): Promise<CulinaryCultureEntity[]> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return restaurant.culinaryCultures;
  }

  async findOne(id: string): Promise<CulinaryCultureEntity> {
    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id },
      relations: ['restaurants'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return culinaryCulture;
  }
}
