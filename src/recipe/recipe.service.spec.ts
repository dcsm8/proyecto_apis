import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { ProductEntity } from '../product/product.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { faker } from '@faker-js/faker';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
describe('RecipeService', () => {
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let productRepository: Repository<ProductEntity>;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let recipesList: RecipeEntity[];
  let mockCacheManager: { get: jest.Mock, set: jest.Mock };
  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        RecipeService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();
    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(getRepositoryToken(CulinaryCultureEntity));
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    productRepository.clear();
    culinaryCultureRepository.clear();
    recipesList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await repository.save({
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        photo: faker.image.url(),
        preparation: faker.lorem.paragraphs(),
        video: faker.internet.url(),
        culinaryCulture: await culinaryCultureRepository.save({
          name: faker.lorem.word(),
          description: faker.lorem.sentence()
        }),
        products: []
      });
      recipesList.push(recipe);
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all recipes from cache if available', async () => {
    mockCacheManager.get.mockResolvedValue(recipesList);
    const recipes: RecipeEntity[] = await service.findAll();
    expect(recipes).toEqual(recipesList);
    expect(mockCacheManager.get).toHaveBeenCalledWith("recipesKey");
    expect(mockCacheManager.set).not.toHaveBeenCalled();
  });
  it('findAll should return all recipes from repository and update cache if not in cache', async () => {
    mockCacheManager.get.mockResolvedValue(null);
    const recipes: RecipeEntity[] = await service.findAll();
    expect(recipes).toEqual(recipesList);
    expect(mockCacheManager.get).toHaveBeenCalledWith("recipesKey");
    expect(mockCacheManager.set).toHaveBeenCalledWith("recipesKey", recipesList);
  });
  it('findOne should return a recipe by id', async () => {
    const storedRecipe: RecipeEntity = recipesList[0];
    const recipe: RecipeEntity = await service.findOne(storedRecipe.id);
    expect(recipe).not.toBeNull();
    expect(recipe.name).toEqual(storedRecipe.name);
    expect(recipe.description).toEqual(storedRecipe.description);
  });
  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });
  it('create should return a new recipe', async () => {
    const recipe: RecipeEntity = {
      id: "",
      name: faker.commerce.productName(),
      description: faker.lorem.paragraph(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraphs(),
      video: faker.internet.url(),
      culinaryCulture: await culinaryCultureRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence()
      }),
      products: []
    };
    const newRecipe: RecipeEntity = await service.create(recipe);
    expect(newRecipe).not.toBeNull();
    const storedRecipe: RecipeEntity = await repository.findOne({where: {id: newRecipe.id}, relations: ["culinaryCulture", "products"]});
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(newRecipe.name);
    expect(storedRecipe.description).toEqual(newRecipe.description);
  });
  it('update should modify a recipe', async () => {
    const recipe: RecipeEntity = recipesList[0];
    recipe.name = "New name";
    recipe.description = "New description";
  
    const updatedRecipe: RecipeEntity = await service.update(recipe.id, recipe);
    expect(updatedRecipe).not.toBeNull();
  
    const storedRecipe: RecipeEntity = await repository.findOne({ where: { id: recipe.id } });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(recipe.name);
    expect(storedRecipe.description).toEqual(recipe.description);
  });
 
  it('update should throw an exception for an invalid recipe', async () => {
    let recipe: RecipeEntity = recipesList[0];
    recipe = {
      ...recipe, name: "New name", description: "New description"
    };
    await expect(() => service.update("0", recipe)).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });
  it('delete should remove a recipe', async () => {
    const recipe: RecipeEntity = recipesList[0];
    await service.delete(recipe.id);
  
    const deletedRecipe: RecipeEntity = await repository.findOne({ where: { id: recipe.id } });
    expect(deletedRecipe).toBeNull();
  });
  it('delete should throw an exception for an invalid recipe', async () => {
    const recipe: RecipeEntity = recipesList[0];
    await service.delete(recipe.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });
});