import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { CategoryEntity } from '../category/category.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryRepository: Repository<CategoryEntity>;
  let productList: ProductEntity[];
  let category: CategoryEntity;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        ProductService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productRepository.clear();
    categoryRepository.clear();

    productList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save({
        name: `Product ${i}`,
        description: `Description ${i}`,
        history: `History ${i}`,
      });
      productList.push(product);
    }

    category = await categoryRepository.save({
      name: 'Test Category',
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    mockCacheManager.get.mockResolvedValue(null);
    const products = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productList[0];
    const product = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: '',
      name: 'New Product',
      description: 'New Description',
      history: 'New History',
      category: null,
      culinaryCultures: [],
      recipes: [],
    };

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await productRepository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name);
  });

  it('update should modify a product', async () => {
    const product: ProductEntity = productList[0];
    product.name = 'New name';
    const updatedProduct: ProductEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct.name).toEqual(product.name);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productList[0];
    product = {
      ...product,
      name: 'New name',
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('delete should remove a product', async () => {
    const product: ProductEntity = productList[0];
    await service.delete(product.id);
    const deletedProduct: ProductEntity = await productRepository.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});
