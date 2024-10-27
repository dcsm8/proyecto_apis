import { Test, TestingModule } from '@nestjs/testing';
import { CulinaryCultureProductService } from './culinary-culture-product.service';
import { Repository } from 'typeorm';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { ProductEntity } from '../product/product.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CulinaryCultureProductService', () => {
  let service: CulinaryCultureProductService;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let productRepository: Repository<ProductEntity>;
  let culinaryCulture: CulinaryCultureEntity;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulinaryCultureProductService],
    }).compile();

    service = module.get<CulinaryCultureProductService>(
      CulinaryCultureProductService,
    );
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(
      getRepositoryToken(CulinaryCultureEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productRepository.clear();
    culinaryCultureRepository.clear();

    productsList = [];
    culinaryCulture = await culinaryCultureRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    });

    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });
      productsList.push(product);
      // Associate product with the culinaryCulture
      await service.addProductCulinaryCulture(culinaryCulture.id, product.id);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductCulinaryCulture should add an product to a culinaryCulture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const newCulinaryCulture: CulinaryCultureEntity =
      await culinaryCultureRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      });

    const result: CulinaryCultureEntity =
      await service.addProductCulinaryCulture(
        newCulinaryCulture.id,
        newProduct.id,
      );

    expect(result.products.length).toBe(1);
    expect(result.products[0]).not.toBeNull();
    expect(result.products[0].name).toBe(newProduct.name);
    expect(result.products[0].description).toBe(newProduct.description);
    expect(result.products[0].history).toBe(newProduct.history);
  });

  it('addProductCulinaryCulture should thrown exception for an invalid product', async () => {
    const newCulinaryCulture: CulinaryCultureEntity =
      await culinaryCultureRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addProductCulinaryCulture(newCulinaryCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('addProductCulinaryCulture should throw an exception for an invalid culinaryCulture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.addProductCulinaryCulture('0', newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The culinaryCulture with the given id was not found',
    );
  });

  it('findProductByCulinaryCultureIdProductId should return product by culinaryCulture', async () => {
    const product: ProductEntity = productsList[0];
    await service.addProductCulinaryCulture(culinaryCulture.id, product.id); // Ensure association
    const storedProduct: ProductEntity =
      await service.findProductByCulinaryCultureIdProductId(
        culinaryCulture.id,
        product.id,
      );
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toBe(product.name);
    expect(storedProduct.description).toBe(product.description);
    expect(storedProduct.history).toBe(product.history);
  });

  it('findProductByCulinaryCultureIdProductId should throw an exception for an invalid product', async () => {
    await expect(() =>
      service.findProductByCulinaryCultureIdProductId(culinaryCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('findProductByCulinaryCultureIdProductId should throw an exception for an invalid culinaryCulture', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() =>
      service.findProductByCulinaryCultureIdProductId('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The culinaryCulture with the given id was not found',
    );
  });

  it('findProductByCulinaryCultureIdProductId should throw an exception for an product not associated to the culinaryCulture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.findProductByCulinaryCultureIdProductId(
        culinaryCulture.id,
        newProduct.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the culinaryCulture',
    );
  });

  it('findProductsByCulinaryCultureId should return products by culinaryCulture', async () => {
    const products: ProductEntity[] =
      await service.findProductsByCulinaryCultureId(culinaryCulture.id);
    expect(products.length).toBe(5);
  });

  it('findProductsByCulinaryCultureId should throw an exception for an invalid culinaryCulture', async () => {
    await expect(() =>
      service.findProductsByCulinaryCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The culinaryCulture with the given id was not found',
    );
  });

  it('associateProductsCulinaryCulture should update products list for a culinaryCulture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const updatedCulinaryCulture: CulinaryCultureEntity =
      await service.associateProductsCulinaryCulture(culinaryCulture.id, [
        newProduct,
      ]);
    expect(updatedCulinaryCulture.products.length).toBe(1);

    expect(updatedCulinaryCulture.products[0].name).toBe(newProduct.name);
    expect(updatedCulinaryCulture.products[0].description).toBe(
      newProduct.description,
    );
    expect(updatedCulinaryCulture.products[0].history).toBe(newProduct.history);
  });

  it('associateProductsCulinaryCulture should throw an exception for an invalid culinaryCulture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.associateProductsCulinaryCulture('0', [newProduct]),
    ).rejects.toHaveProperty(
      'message',
      'The culinaryCulture with the given id was not found',
    );
  });

  it('associateProductsCulinaryCulture should throw an exception for an invalid product', async () => {
    const newProduct: ProductEntity = productsList[0];
    newProduct.id = '0';

    await expect(() =>
      service.associateProductsCulinaryCulture(culinaryCulture.id, [
        newProduct,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductCulinaryCulture should remove an product from a culinaryCulture', async () => {
    const product: ProductEntity = productsList[0];

    await service.deleteProductCulinaryCulture(culinaryCulture.id, product.id);

    const storedCulinaryCulture: CulinaryCultureEntity =
      await culinaryCultureRepository.findOne({
        where: { id: culinaryCulture.id },
        relations: ['products'],
      });
    const deletedProduct: ProductEntity = storedCulinaryCulture.products.find(
      (a) => a.id === product.id,
    );

    expect(deletedProduct).toBeUndefined();
  });

  it('deleteProductCulinaryCulture should thrown an exception for an invalid product', async () => {
    await expect(() =>
      service.deleteProductCulinaryCulture(culinaryCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('deleteProductCulinaryCulture should thrown an exception for an invalid culinaryCulture', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() =>
      service.deleteProductCulinaryCulture('0', product.id),
    ).rejects.toHaveProperty(
      'message',
      'The culinaryCulture with the given id was not found',
    );
  });

  it('deleteProductCulinaryCulture should thrown an exception for an non asocciated product', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    await expect(() =>
      service.deleteProductCulinaryCulture(culinaryCulture.id, newProduct.id),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id is not associated to the culinaryCulture',
    );
  });

  it('findOne should return a culinary culture by id', async () => {
    const result = await service.findOne(culinaryCulture.id);
    expect(result).not.toBeNull();
    expect(result.id).toEqual(culinaryCulture.id);
    expect(result.name).toEqual(culinaryCulture.name);
    expect(result.products).toBeDefined();
  });

  it('findOne should throw an exception for an invalid culinary culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The culinary culture with the given id was not found',
    );
  });
});
