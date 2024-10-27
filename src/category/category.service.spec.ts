import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { CategoryEntity } from './category.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<CategoryEntity>;
  let categoryList: CategoryEntity[];

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        CategoryService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoryList = [];
    for (let i = 0; i < 5; i++) {
      const category: CategoryEntity = await repository.save({
        name: `Category ${i}`,
      });
      categoryList.push(category);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categories', async () => {
    mockCacheManager.get.mockResolvedValue(null);
    const categories: CategoryEntity[] = await service.findAll();
    expect(categories).not.toBeNull();
    expect(categories).toHaveLength(categoryList.length);
  });

  it('findOne should return a category by id', async () => {
    const storedCategory: CategoryEntity = categoryList[0];
    const category: CategoryEntity = await service.findOne(storedCategory.id);
    expect(category).not.toBeNull();
    expect(category.name).toEqual(storedCategory.name);
  });

  it('findOne should throw an exception for an invalid category', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('create should return a new category', async () => {
    const category: CategoryEntity = {
      id: '',
      name: 'New Category',
      products: [],
    };

    const newCategory: CategoryEntity = await service.create(category);
    expect(newCategory).not.toBeNull();

    const storedCategory: CategoryEntity = await repository.findOne({
      where: { id: newCategory.id },
    });
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toEqual(newCategory.name);
  });

  it('update should modify a category', async () => {
    const category: CategoryEntity = categoryList[0];
    category.name = 'New name';
    const updatedCategory: CategoryEntity = await service.update(
      category.id,
      category,
    );
    expect(updatedCategory).not.toBeNull();
    expect(updatedCategory.name).toEqual(category.name);
  });

  it('update should throw an exception for an invalid category', async () => {
    let category: CategoryEntity = categoryList[0];
    category = {
      ...category,
      name: 'New name',
    };
    await expect(() => service.update('0', category)).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('delete should remove a category', async () => {
    const category: CategoryEntity = categoryList[0];
    await service.delete(category.id);
    const deletedCategory: CategoryEntity = await repository.findOne({
      where: { id: category.id },
    });
    expect(deletedCategory).toBeNull();
  });

  it('delete should throw an exception for an invalid category', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });
});
