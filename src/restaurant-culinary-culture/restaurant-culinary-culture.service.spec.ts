import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantCulinaryCultureService } from './restaurant-culinary-culture.service';
import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('RestaurantCulinaryCultureService', () => {
  let service: RestaurantCulinaryCultureService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let restaurant: RestaurantEntity;
  let culinaryCulturesList: CulinaryCultureEntity[];
  let mockCacheManager: any;

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        RestaurantCulinaryCultureService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RestaurantCulinaryCultureService>(
      RestaurantCulinaryCultureService,
    );
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(
      getRepositoryToken(CulinaryCultureEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    culinaryCultureRepository.clear();
    restaurantRepository.clear();

    culinaryCulturesList = [];
    for (let i = 0; i < 5; i++) {
      const culinaryCulture: CulinaryCultureEntity =
        await culinaryCultureRepository.save({
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
        });
      culinaryCulturesList.push(culinaryCulture);
    }

    restaurant = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      country: faker.location.country(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      culinaryCultures: [culinaryCulturesList[0]],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulinaryCultureToRestaurant should add culinary culture to a restaurant', async () => {
    const newCulinaryCulture: CulinaryCultureEntity =
      await culinaryCultureRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      });

    const updatedRestaurant: RestaurantEntity =
      await service.addCulinaryCultureToRestaurant(
        restaurant.id,
        newCulinaryCulture.id,
      );
    expect(updatedRestaurant.culinaryCultures.length).toBe(2);
    expect(
      updatedRestaurant.culinaryCultures.some(
        (c) => c.id === newCulinaryCulture.id,
      ),
    ).toBeTruthy();
  });

  it('findCulinaryCultureByRestaurantIdCulinaryCultureId should return culinary culture by restaurant and culinary culture id', async () => {
    const storedCulinaryCulture: CulinaryCultureEntity =
      culinaryCulturesList[0];
    const culinaryCulture: CulinaryCultureEntity =
      await service.findCulinaryCultureByRestaurantIdCulinaryCultureId(
        restaurant.id,
        storedCulinaryCulture.id,
      );
    expect(culinaryCulture).not.toBeNull();
    expect(culinaryCulture.id).toBe(storedCulinaryCulture.id);
  });

  it('findCulinaryCultureByRestaurantIdCulinaryCultureId should throw an exception for an invalid culinary culture', async () => {
    await expect(() =>
      service.findCulinaryCultureByRestaurantIdCulinaryCultureId(
        restaurant.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The culinary culture with the given id is not associated to the restaurant',
    );
  });

  it('associateCulinaryCulturesRestaurant should update culinary cultures list for a restaurant', async () => {
    const newCulinaryCulturesList = [
      culinaryCulturesList[1],
      culinaryCulturesList[2],
    ];

    const updatedRestaurant: RestaurantEntity =
      await service.associateCulinaryCulturesRestaurant(
        restaurant.id,
        newCulinaryCulturesList,
      );
    expect(updatedRestaurant.culinaryCultures.length).toBe(2);
    expect(
      updatedRestaurant.culinaryCultures.some(
        (c) => c.id === newCulinaryCulturesList[0].id,
      ),
    ).toBeTruthy();
    expect(
      updatedRestaurant.culinaryCultures.some(
        (c) => c.id === newCulinaryCulturesList[1].id,
      ),
    ).toBeTruthy();
  });

  it('deleteCulinaryCultureFromRestaurant should remove a culinary culture from a restaurant', async () => {
    const culinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];

    await service.deleteCulinaryCultureFromRestaurant(
      restaurant.id,
      culinaryCulture.id,
    );

    const storedRestaurant: RestaurantEntity =
      await restaurantRepository.findOne({
        where: { id: restaurant.id },
        relations: ['culinaryCultures'],
      });
    const deletedCulinaryCulture: CulinaryCultureEntity =
      storedRestaurant.culinaryCultures.find(
        (a) => a.id === culinaryCulture.id,
      );

    expect(deletedCulinaryCulture).toBeUndefined();
  });

  it('deleteCulinaryCultureFromRestaurant should thrown an exception for a non associated culinary culture', async () => {
    const newCulinaryCulture: CulinaryCultureEntity =
      await culinaryCultureRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      });

    await expect(() =>
      service.deleteCulinaryCultureFromRestaurant(
        restaurant.id,
        newCulinaryCulture.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The culinary culture with the given id is not associated to the restaurant',
    );
  });

  it('findCulinaryCulturesByRestaurantId should return the list of culinary cultures associated with a restaurant', async () => {
    const culinaryCultures: CulinaryCultureEntity[] =
      await service.findCulinaryCulturesByRestaurantId(restaurant.id);

    expect(culinaryCultures).not.toBeNull();
    expect(culinaryCultures.length).toBe(1);
    expect(culinaryCultures[0].id).toBe(culinaryCulturesList[0].id);
  });

  it('findCulinaryCulturesByRestaurantId should throw an exception if the restaurant does not exist', async () => {
    await expect(() =>
      service.findCulinaryCulturesByRestaurantId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});
