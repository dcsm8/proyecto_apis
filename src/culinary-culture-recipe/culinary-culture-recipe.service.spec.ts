import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { CulinaryCultureRecipeService } from './culinary-culture-recipe.service';
import { faker } from '@faker-js/faker';

describe('CulinaryCultureRecipeService', () => {
  let service: CulinaryCultureRecipeService;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let recipeRepository: Repository<RecipeEntity>;
  let culinaryCulture: CulinaryCultureEntity;
  let recipesList : RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulinaryCultureRecipeService],
    }).compile();

    service = module.get<CulinaryCultureRecipeService>(CulinaryCultureRecipeService);
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(getRepositoryToken(CulinaryCultureEntity));
    recipeRepository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recipeRepository.clear();
    culinaryCultureRepository.clear();

    recipesList = [];
    for(let i = 0; i < 5; i++){
        const recipe: RecipeEntity = await recipeRepository.save({
          name: faker.lorem.word(),
          description: faker.lorem.sentence(),
          photo: faker.image.url(),
          preparation: faker.lorem.paragraph(),
          video: faker.internet.url()
        })
        recipesList.push(recipe);
    }

    culinaryCulture = await culinaryCultureRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      recipes: [recipesList[0]]
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecipeCulinaryCulture should add a recipe to a culinary culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraph(),
      video: faker.internet.url()
    });

    const updatedCulinaryCulture: CulinaryCultureEntity = await service.addRecipeCulinaryCulture(culinaryCulture.id, newRecipe);
    expect(updatedCulinaryCulture.recipes.length).toBe(2);
    expect(updatedCulinaryCulture.recipes.some(recipe => recipe.id === newRecipe.id)).toBeTruthy();
  });

  it('findRecipeByCulinaryCultureIdRecipeId should return recipe by culinary culture and recipe id', async () => {
    const storedRecipe: RecipeEntity = recipesList[0];
    const recipe: RecipeEntity = await service.findRecipeByCulinaryCultureIdRecipeId(culinaryCulture.id, storedRecipe.id);
    expect(recipe).not.toBeNull();
    expect(recipe.name).toBe(storedRecipe.name);
  });

  it('findRecipeByCulinaryCultureIdRecipeId should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findRecipeByCulinaryCultureIdRecipeId(culinaryCulture.id, "0")).rejects.toHaveProperty("message", "The recipe with the given id was not found");
  });

  it('findRecipesByCulinaryCultureId should return all recipes for a culinary culture', async () => {
    const recipes: RecipeEntity[] = await service.findRecipesByCulinaryCultureId(culinaryCulture.id);
    expect(recipes.length).toBe(1);
  });

  it('associateRecipesCulinaryCulture should update recipes list for a culinary culture', async () => {
    const newRecipesList = [recipesList[1], recipesList[2]];
  
    const updatedCulinaryCulture: CulinaryCultureEntity = await service.associateRecipesCulinaryCulture(culinaryCulture.id, newRecipesList);
    expect(updatedCulinaryCulture.recipes.length).toBe(2);
    expect(updatedCulinaryCulture.recipes.some(recipe => recipe.id === newRecipesList[0].id)).toBeTruthy();
    expect(updatedCulinaryCulture.recipes.some(recipe => recipe.id === newRecipesList[1].id)).toBeTruthy();
  });

  it('deleteRecipeCulinaryCulture should remove a recipe from a culinary culture', async () => {
    const recipe: RecipeEntity = recipesList[0];
  
    await service.deleteRecipeCulinaryCulture(culinaryCulture.id, recipe.id);
  
    const storedCulinaryCulture: CulinaryCultureEntity = await culinaryCultureRepository.findOne({where: {id: culinaryCulture.id}, relations: ["recipes"]});
    const deletedRecipe: RecipeEntity = storedCulinaryCulture.recipes.find(a => a.id === recipe.id);
  
    expect(deletedRecipe).toBeUndefined();
  });

  it('deleteRecipeCulinaryCulture should throw an exception for a non-associated recipe', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraph(),
      video: faker.internet.url()
    });
 
    await expect(() => service.deleteRecipeCulinaryCulture(culinaryCulture.id, newRecipe.id)).rejects.toHaveProperty("message", "The recipe with the given id is not associated to the culinary culture");
  });
});