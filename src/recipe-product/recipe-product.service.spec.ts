import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecipeEntity } from '../recipe/recipe.entity';
import { ProductEntity } from '../product/product.entity';
import { CategoryEntity } from '../category/category.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RecipeProductService } from './recipe-product.service';
import { faker } from '@faker-js/faker';

describe('RecipeProductService', () => {
  let service: RecipeProductService;
  let recipeRepository: Repository<RecipeEntity>;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoryEntity>;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let recipe: RecipeEntity;
  let productsList: ProductEntity[];
  let category: CategoryEntity;
  let culinaryCulture: CulinaryCultureEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecipeProductService],
    }).compile();

    service = module.get<RecipeProductService>(RecipeProductService);
    recipeRepository = module.get<Repository<RecipeEntity>>(getRepositoryToken(RecipeEntity));
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(getRepositoryToken(CulinaryCultureEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recipeRepository.clear();
    productRepository.clear();
    categoryRepository.clear();
    culinaryCultureRepository.clear();

    category = await categoryRepository.save({
      name: faker.lorem.word(),
    });

    culinaryCulture = await culinaryCultureRepository.save({
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
    });

    productsList = [];
    for(let i = 0; i < 5; i++){
        const product: ProductEntity = await productRepository.save({
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          history: faker.lorem.paragraph(),
          category: category,
          culinaryCultures: [culinaryCulture],
        });
        productsList.push(product);
    }

    recipe = await recipeRepository.save({
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraph(),
      video: faker.internet.url(),
      culinaryCulture: culinaryCulture,
      products: [productsList[0]]
    });

    await recipeRepository.save({
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparation: faker.lorem.paragraph(),
      video: faker.internet.url(),
      culinaryCulture: culinaryCulture,
      products: [productsList[0]]
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductToRecipe should add a product to a recipe', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      history: faker.lorem.paragraph(),
      category: category,
      culinaryCultures: [culinaryCulture],
    });

    const updatedRecipe: RecipeEntity = await service.addProductToRecipe(recipe.id, newProduct.id);
    expect(updatedRecipe.products.length).toBe(2);
    expect(updatedRecipe.products.some(product => product.id === newProduct.id)).toBeTruthy();
  });

  it('findProductByRecipeIdProductId should return product by recipe and product id', async () => {
    const storedProduct: ProductEntity = productsList[0];
    const product: ProductEntity = await service.findProductByRecipeIdProductId(recipe.id, storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toBe(storedProduct.name);
  });

  it('findProductByRecipeIdProductId should throw an exception for an invalid product', async () => {
    await expect(() => service.findProductByRecipeIdProductId(recipe.id, "0")).rejects.toHaveProperty("message", "The product with the given id is not associated to the recipe");
  });

  it('findProductsByRecipeId should return all products for a recipe', async () => {
    const products: ProductEntity[] = await service.findProductsByRecipeId(recipe.id);
    expect(products.length).toBe(1);
  });

  it('associateProductsRecipe should update products list for a recipe', async () => {
    const newProductsList = [productsList[1], productsList[2]];

    const updatedRecipe: RecipeEntity = await service.associateProductsRecipe(recipe.id, newProductsList);
    expect(updatedRecipe.products.length).toBe(2);
    expect(updatedRecipe.products.some(product => product.id === newProductsList[0].id)).toBeTruthy();
    expect(updatedRecipe.products.some(product => product.id === newProductsList[1].id)).toBeTruthy();
  });

  it('deleteProductRecipe should remove a product from a recipe', async () => {
    const product: ProductEntity = productsList[0];

    await service.deleteProductRecipe(recipe.id, product.id);

    const storedRecipe: RecipeEntity = await recipeRepository.findOne({where: {id: recipe.id}, relations: ["products"]});
    const deletedProduct: ProductEntity = storedRecipe.products.find(a => a.id === product.id);

    expect(deletedProduct).toBeUndefined();
  });

  it('deleteProductRecipe should throw an exception for a non-associated product', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      history: faker.lorem.paragraph(),
      category: category,
      culinaryCultures: [culinaryCulture],
    });

    await expect(() => service.deleteProductRecipe(recipe.id, newProduct.id)).rejects.toHaveProperty("message", "The product with the given id is not associated to the recipe");
  });

  it('should create a product with correct category and culinary culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      history: faker.lorem.paragraph(),
      category: category,
      culinaryCultures: [culinaryCulture],
    });

    const foundProduct = await productRepository.findOne({
      where: { id: newProduct.id },
      relations: ['category', 'culinaryCultures']
    });

    expect(foundProduct.category.id).toBe(category.id);
    expect(foundProduct.culinaryCultures[0].id).toBe(culinaryCulture.id);
  });

  it('should create a recipe associated with a culinary culture', async () => {
    const foundRecipe = await recipeRepository.findOne({
      where: { id: recipe.id },
      relations: ['culinaryCulture']
    });

    expect(foundRecipe.culinaryCulture.id).toBe(culinaryCulture.id);
  });
});