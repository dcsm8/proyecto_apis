import { Test, TestingModule } from '@nestjs/testing';
import { CategoryProductService } from './category-product.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CategoryProductService', () => {
  let service: CategoryProductService;
  let categoryRepository: Repository<CategoryEntity>;
  let productRepository: Repository<ProductEntity>;
  let category: CategoryEntity;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoryProductService],
    }).compile();

    service = module.get<CategoryProductService>(CategoryProductService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productRepository.clear();
    categoryRepository.clear();

    productsList = [];
    category = await categoryRepository.save({
      name: faker.lorem.word(),
    });

    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });
      productsList.push(product);
      // Associate product with the category
      await service.addProductCategory(category.id, product.id);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductCategory should add an product to a category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const newCategory: CategoryEntity = await categoryRepository.save({
      name: faker.lorem.word(),
    });

    const result: CategoryEntity = await service.addProductCategory(
      newCategory.id,
      newProduct.id,
    );

    expect(result.products.length).toBe(1);
    expect(result.products[0]).not.toBeNull();
    expect(result.products[0].name).toBe(newProduct.name);
    expect(result.products[0].description).toBe(newProduct.description);
    expect(result.products[0].history).toBe(newProduct.history);
  });

  it('addProductCategory should thrown exception for an invalid product', async () => {
    const newCategory: CategoryEntity = await categoryRepository.save({
      name: faker.lorem.word(),
    });

    await expect(() =>
      service.addProductCategory(newCategory.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addProductCategory should throw an exception for an invalid category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addProductCategory('0', newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('findProductByCategoryIdProductId should return product by category', async () => {
    const product: ProductEntity = productsList[0];
    await service.addProductCategory(category.id, product.id); // Ensure association
    const storedProduct: ProductEntity =
      await service.findProductByCategoryIdProductId(category.id, product.id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toBe(product.name);
    expect(storedProduct.description).toBe(product.description);
    expect(storedProduct.history).toBe(product.history);
  });

  it('findProductByCategoryIdProductId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findProductByCategoryIdProductId(category.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findProductByCategoryIdProductId should throw an exception for an invalid category', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() =>
      service.findProductByCategoryIdProductId('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('findProductByCategoryIdProductId should throw an exception for an product not associated to the category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.findProductByCategoryIdProductId(category.id, newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the category',
    );
  });

  it('findProductsByCategoryId should return products by category', async () => {
    const products: ProductEntity[] = await service.findProductsByCategoryId(
      category.id,
    );
    expect(products.length).toBe(5);
  });

  it('findProductsByCategoryId should throw an exception for an invalid category', async () => {
    await expect(() =>
      service.findProductsByCategoryId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('associateProductsCategory should update products list for a category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const updatedCategory: CategoryEntity =
      await service.associateProductsCategory(category.id, [newProduct]);
    expect(updatedCategory.products.length).toBe(1);

    expect(updatedCategory.products[0].name).toBe(newProduct.name);
    expect(updatedCategory.products[0].description).toBe(
      newProduct.description,
    );
    expect(updatedCategory.products[0].history).toBe(newProduct.history);
  });

  it('associateProductsCategory should throw an exception for an invalid category', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.associateProductsCategory('0', [newProduct]),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('associateProductsCategory should throw an exception for an invalid product', async () => {
    const newProduct: ProductEntity = productsList[0];
    newProduct.id = '0';

    await expect(() =>
      service.associateProductsCategory(category.id, [newProduct]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductCategory should remove an product from a category', async () => {
    const product: ProductEntity = productsList[0];

    await service.deleteProductCategory(category.id, product.id);

    const storedCategory: CategoryEntity = await categoryRepository.findOne({
      where: { id: category.id },
      relations: ['products'],
    });
    const deletedProduct: ProductEntity = storedCategory.products.find(
      (a) => a.id === product.id,
    );

    expect(deletedProduct).toBeUndefined();
  });

  it('deleteProductCategory should thrown an exception for an invalid product', async () => {
    await expect(() =>
      service.deleteProductCategory(category.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductCategory should thrown an exception for an invalid category', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() =>
      service.deleteProductCategory('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('deleteProductCategory should thrown an exception for an non asocciated product', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.deleteProductCategory(category.id, newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the category',
    );
  });
});
