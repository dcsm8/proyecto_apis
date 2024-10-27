import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let restaurantList: RestaurantEntity[];
  let culinaryCulture: CulinaryCultureEntity;
  let mockCacheManager: any;

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        RestaurantService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(
      getRepositoryToken(CulinaryCultureEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    culinaryCultureRepository.clear();

    restaurantList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: `Restaurant ${i}`,
        city: `City ${i}`,
        country: `Country ${i}`,
        michelinStars: i,
        michelinStarDate: new Date(),
      });
      restaurantList.push(restaurant);
    }

    culinaryCulture = await culinaryCultureRepository.save({
      name: 'Test Culture',
      description: 'Test Description',
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants from cache', async () => {
    const cachedRestaurants = [...restaurantList];
    mockCacheManager.get.mockResolvedValue(cachedRestaurants);

    const restaurants = await service.findAll();
    expect(restaurants).toEqual(cachedRestaurants);
    expect(mockCacheManager.get).toHaveBeenCalledWith('restaurantsKey');
    expect(mockCacheManager.set).not.toHaveBeenCalled();
  });

  it('findAll should return all restaurants from the repository and update cache', async () => {
    mockCacheManager.get.mockResolvedValue(null);

    const restaurants = await service.findAll();
    expect(restaurants).not.toBeNull();
    expect(restaurants).toHaveLength(restaurantList.length);
    expect(mockCacheManager.get).toHaveBeenCalledWith('restaurantsKey');
    expect(mockCacheManager.set).toHaveBeenCalledWith(
      'restaurantsKey',
      restaurants,
    );
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurant: RestaurantEntity = restaurantList[0];
    const restaurant = await service.findOne(storedRestaurant.id);
    expect(restaurant).not.toBeNull();
    expect(restaurant.name).toEqual(storedRestaurant.name);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurant: RestaurantEntity = {
      id: '',
      name: 'New Restaurant',
      city: 'New City',
      country: 'New Country',
      michelinStars: 2,
      michelinStarDate: new Date(),
      culinaryCultures: [],
    };

    const newRestaurant: RestaurantEntity = await service.create(restaurant);
    expect(newRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity =
      await restaurantRepository.findOne({ where: { id: newRestaurant.id } });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(newRestaurant.name);
  });

  it('update should modify a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    restaurant.name = 'New name';
    const updatedRestaurant: RestaurantEntity = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updatedRestaurant).not.toBeNull();
    expect(updatedRestaurant.name).toEqual(restaurant.name);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurant: RestaurantEntity = restaurantList[0];
    restaurant = {
      ...restaurant,
      name: 'New name',
    };
    await expect(() => service.update('0', restaurant)).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantList[0];
    await service.delete(restaurant.id);
    const deletedRestaurant: RestaurantEntity =
      await restaurantRepository.findOne({ where: { id: restaurant.id } });
    expect(deletedRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});
