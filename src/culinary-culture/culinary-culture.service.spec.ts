import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulinaryCultureEntity } from './culinary-culture.entity';
import { CulinaryCultureService } from './culinary-culture.service';
import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CulinaryCultureService', () => {
  let service: CulinaryCultureService;
  let repository: Repository<CulinaryCultureEntity>;
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
        CulinaryCultureService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CulinaryCultureService>(CulinaryCultureService);
    repository = module.get<Repository<CulinaryCultureEntity>>(
      getRepositoryToken(CulinaryCultureEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    culinaryCulturesList = [];
    for (let i = 0; i < 5; i++) {
      const culinaryCulture: CulinaryCultureEntity = await repository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        countries: [],
        products: [],
        recipes: [],
        restaurants: [],
      });
      culinaryCulturesList.push(culinaryCulture);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all culinary cultures from cache', async () => {
    const cachedCultures = [...culinaryCulturesList];
    mockCacheManager.get.mockResolvedValue(cachedCultures);

    const culinaryCultures: CulinaryCultureEntity[] = await service.findAll();
    expect(culinaryCultures).toEqual(cachedCultures);
    expect(mockCacheManager.get).toHaveBeenCalledWith("culinary-culture");
    expect(mockCacheManager.set).not.toHaveBeenCalled();
  });

  it('findAll should return all culinary cultures from the repository and update cache', async () => {
    mockCacheManager.get.mockResolvedValue(null);

    const culinaryCultures: CulinaryCultureEntity[] = await service.findAll();
    expect(culinaryCultures).not.toBeNull();
    expect(culinaryCultures).toHaveLength(culinaryCulturesList.length);
    expect(mockCacheManager.get).toHaveBeenCalledWith("culinary-culture");
    expect(mockCacheManager.set).toHaveBeenCalledWith("culinary-culture", culinaryCultures);
  });

  it('findOne should return a culinary culture by id', async () => {
    const storedCulinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];
    const culinaryCulture: CulinaryCultureEntity = await service.findOne(storedCulinaryCulture.id);
    expect(culinaryCulture).not.toBeNull();
    expect(culinaryCulture.name).toEqual(storedCulinaryCulture.name);
    expect(culinaryCulture.description).toEqual(storedCulinaryCulture.description);
  });

  it('findOne should throw an exception for an invalid culinary culture', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The culinary culture with the given id was not found");
  });

  it('create should return a new culinary culture', async () => {
    const culinaryCulture: CulinaryCultureEntity = {
      id: "",
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      countries: [],
      products: [],
      recipes: [],
      restaurants: [],
    };

    const newCulinaryCulture: CulinaryCultureEntity = await service.create(culinaryCulture);
    expect(newCulinaryCulture).not.toBeNull();

    const storedCulinaryCulture: CulinaryCultureEntity = await repository.findOne({where: {id: newCulinaryCulture.id}});
    expect(storedCulinaryCulture).not.toBeNull();
    expect(storedCulinaryCulture.name).toEqual(newCulinaryCulture.name);
    expect(storedCulinaryCulture.description).toEqual(newCulinaryCulture.description);
  });

  it('update should modify a culinary culture', async () => {
    const culinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];
    culinaryCulture.name = "New name";
    culinaryCulture.description = "New description";
  
    const updatedCulinaryCulture: CulinaryCultureEntity = await service.update(culinaryCulture.id, culinaryCulture);
    expect(updatedCulinaryCulture).not.toBeNull();
  
    const storedCulinaryCulture: CulinaryCultureEntity = await repository.findOne({ where: { id: culinaryCulture.id } });
    expect(storedCulinaryCulture).not.toBeNull();
    expect(storedCulinaryCulture.name).toEqual(culinaryCulture.name);
    expect(storedCulinaryCulture.description).toEqual(culinaryCulture.description);
  });
 
  it('update should throw an exception for an invalid culinary culture', async () => {
    let culinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];
    culinaryCulture = {
      ...culinaryCulture, name: "New name", description: "New description"
    };
    await expect(() => service.update("0", culinaryCulture)).rejects.toHaveProperty("message", "The culinary culture with the given id was not found");
  });

  it('delete should remove a culinary culture', async () => {
    const culinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];
    await service.delete(culinaryCulture.id);
  
    const deletedCulinaryCulture: CulinaryCultureEntity = await repository.findOne({ where: { id: culinaryCulture.id } });
    expect(deletedCulinaryCulture).toBeNull();
  });

  it('delete should throw an exception for an invalid culinary culture', async () => {
    const culinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];
    await service.delete(culinaryCulture.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The culinary culture with the given id was not found");
  });
});