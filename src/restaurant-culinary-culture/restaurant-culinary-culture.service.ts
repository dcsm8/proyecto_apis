import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RestaurantCulinaryCultureService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(CulinaryCultureEntity)
    private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addCulinaryCultureToRestaurant(
    restaurantId: string,
    culinaryCultureId: string,
  ): Promise<RestaurantEntity> {
    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id: culinaryCultureId },
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    restaurant.culinaryCultures = [
      ...restaurant.culinaryCultures,
      culinaryCulture,
    ];
    return await this.restaurantRepository.save(restaurant);
  }

  async findCulinaryCulturesByRestaurantId(
    restaurantId: string,
  ): Promise<CulinaryCultureEntity[]> {
    const cachedCulinaryCultures = await this.cacheManager.get<
      CulinaryCultureEntity[]
    >(`culinaryCultures_${restaurantId}`);
    if (cachedCulinaryCultures) {
      return cachedCulinaryCultures;
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culinaryCultures = restaurant.culinaryCultures;
    await this.cacheManager.set(
      `culinaryCultures_${restaurantId}`,
      culinaryCultures,
    );

    return culinaryCultures;
  }

  async findCulinaryCultureByRestaurantIdCulinaryCultureId(
    restaurantId: string,
    culinaryCultureId: string,
  ): Promise<CulinaryCultureEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culinaryCulture = restaurant.culinaryCultures.find(
      (c) => c.id === culinaryCultureId,
    );
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id is not associated to the restaurant',
        BusinessError.PRECONDITION_FAILED,
      );

    return culinaryCulture;
  }

  async associateCulinaryCulturesRestaurant(
    restaurantId: string,
    culinaryCultures: CulinaryCultureEntity[],
  ): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < culinaryCultures.length; i++) {
      const culinaryCulture = await this.culinaryCultureRepository.findOne({
        where: { id: culinaryCultures[i].id },
      });
      if (!culinaryCulture)
        throw new BusinessLogicException(
          'The culinary culture with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    restaurant.culinaryCultures = culinaryCultures;
    return await this.restaurantRepository.save(restaurant);
  }

  async deleteCulinaryCultureFromRestaurant(
    restaurantId: string,
    culinaryCultureId: string,
  ) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['culinaryCultures'],
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culinaryCulture = restaurant.culinaryCultures.find(
      (c) => c.id === culinaryCultureId,
    );
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id is not associated to the restaurant',
        BusinessError.PRECONDITION_FAILED,
      );

    restaurant.culinaryCultures = restaurant.culinaryCultures.filter(
      (c) => c.id !== culinaryCultureId,
    );
    await this.restaurantRepository.save(restaurant);
  }
}
