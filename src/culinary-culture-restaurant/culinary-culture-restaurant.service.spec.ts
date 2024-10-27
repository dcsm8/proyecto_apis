import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CulinaryCultureRestaurantService } from './culinary-culture-restaurant.service';
import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CulinaryCultureRestaurantService', () => {
  let service: CulinaryCultureRestaurantService;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let culinaryCulture: CulinaryCultureEntity;
  let restaurantsList: RestaurantEntity[];
  let cacheManagerMock: jest.Mocked<any>;

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        CulinaryCultureRestaurantService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    service = module.get<CulinaryCultureRestaurantService>(
      CulinaryCultureRestaurantService,
    );
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(
      getRepositoryToken(CulinaryCultureEntity),
    );
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    culinaryCultureRepository.clear();

    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        country: faker.location.country(),
        michelinStars: faker.number.int({ min: 0, max: 3 }),
      });
      restaurantsList.push(restaurant);
    }

    culinaryCulture = await culinaryCultureRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      restaurants: [restaurantsList[0]],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantToCulinaryCulture should add restaurant to a culinary culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      country: faker.location.country(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
    });

    const updatedCulinaryCulture: CulinaryCultureEntity =
      await service.addRestaurantToCulinaryCulture(
        culinaryCulture.id,
        newRestaurant.id,
      );
    expect(updatedCulinaryCulture.restaurants.length).toBe(2);
    expect(
      updatedCulinaryCulture.restaurants.some(
        (restaurant) => restaurant.id === newRestaurant.id,
      ),
    ).toBeTruthy();
  });

  it('findRestaurantsByCulinaryCultureId should return restaurants by culinary culture', async () => {
    const cacheKey = `culinaryCulture_${culinaryCulture.id}_restaurants`;
    cacheManagerMock.get.mockResolvedValueOnce(null); // Cache miss

    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsByCulinaryCultureId(culinaryCulture.id);

    expect(restaurants.length).toBe(1);
    expect(restaurants[0].id).toBe(restaurantsList[0].id);
    expect(cacheManagerMock.get).toHaveBeenCalledWith(cacheKey);
    expect(cacheManagerMock.set).toHaveBeenCalledWith(cacheKey, restaurants);
  });

  it('findRestaurantsByCulinaryCultureId should return cached restaurants', async () => {
    const cacheKey = `culinaryCulture_${culinaryCulture.id}_restaurants`;
    const cachedRestaurants = [restaurantsList[0]];
    cacheManagerMock.get.mockResolvedValueOnce(cachedRestaurants); // Cache hit

    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsByCulinaryCultureId(culinaryCulture.id);

    expect(restaurants.length).toBe(1);
    expect(restaurants[0].id).toBe(restaurantsList[0].id);
    expect(cacheManagerMock.get).toHaveBeenCalledWith(cacheKey);
    expect(cacheManagerMock.set).not.toHaveBeenCalled();
  });

  it('findRestaurantByCulinaryCultureIdRestaurantId should return restaurant by culinary culture and restaurant id', async () => {
    const storedRestaurant: RestaurantEntity = restaurantsList[0];
    const restaurant: RestaurantEntity =
      await service.findRestaurantByCulinaryCultureIdRestaurantId(
        culinaryCulture.id,
        storedRestaurant.id,
      );
    expect(restaurant).not.toBeNull();
    expect(restaurant.id).toBe(storedRestaurant.id);
  });

  it('findRestaurantByCulinaryCultureIdRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findRestaurantByCulinaryCultureIdRestaurantId(
        culinaryCulture.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the culinary culture',
    );
  });

  it('associateRestaurantsCulinaryCulture should update restaurants list for a culinary culture', async () => {
    const newRestaurantsList = [restaurantsList[1], restaurantsList[2]];

    const updatedCulinaryCulture: CulinaryCultureEntity =
      await service.associateRestaurantsCulinaryCulture(
        culinaryCulture.id,
        newRestaurantsList,
      );
    expect(updatedCulinaryCulture.restaurants.length).toBe(2);
    expect(
      updatedCulinaryCulture.restaurants.some(
        (restaurant) => restaurant.id === newRestaurantsList[0].id,
      ),
    ).toBeTruthy();
    expect(
      updatedCulinaryCulture.restaurants.some(
        (restaurant) => restaurant.id === newRestaurantsList[1].id,
      ),
    ).toBeTruthy();
  });

  it('deleteRestaurantFromCulinaryCulture should remove a restaurant from a culinary culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteRestaurantFromCulinaryCulture(
      culinaryCulture.id,
      restaurant.id,
    );

    const storedCulinaryCulture: CulinaryCultureEntity =
      await culinaryCultureRepository.findOne({
        where: { id: culinaryCulture.id },
        relations: ['restaurants'],
      });
    const deletedRestaurant: RestaurantEntity =
      storedCulinaryCulture.restaurants.find((a) => a.id === restaurant.id);

    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteRestaurantFromCulinaryCulture should thrown an exception for an non asocciated restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      country: faker.location.country(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
    });

    await expect(() =>
      service.deleteRestaurantFromCulinaryCulture(
        culinaryCulture.id,
        newRestaurant.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the culinary culture',
    );
  });

  it('findCulinaryCulturesByRestaurantId should return culinary cultures by restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const culinaryCultures: CulinaryCultureEntity[] =
      await service.findCulinaryCulturesByRestaurantId(restaurant.id);
    expect(culinaryCultures.length).toBe(1);
    expect(culinaryCultures[0].id).toBe(culinaryCulture.id);
  });

  it('findOne should return a culinary culture by id', async () => {
    const result = await service.findOne(culinaryCulture.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(culinaryCulture.id);
    expect(result.name).toEqual(culinaryCulture.name);
    expect(result.restaurants).toBeDefined();
  });

  it('findOne should throw an exception for an invalid culinary culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The culinary culture with the given id was not found',
    );
  });
});
