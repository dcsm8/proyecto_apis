import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CategoryProductService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async addProductCategory(
    categoryId: string,
    productId: string,
  ): Promise<CategoryEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const category: CategoryEntity = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    category.products = [...category.products, product];
    return await this.categoryRepository.save(category);
  }

  async findProductByCategoryIdProductId(
    categoryId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const { category, product } = await this.findProductAndCategory(
      categoryId,
      productId,
    );

    const categoryProduct: ProductEntity = category.products.find(
      (e) => e.id === product.id,
    );
    if (!categoryProduct)
      throw new BusinessLogicException(
        'The product with the given id is not associated to the category',
        BusinessError.PRECONDITION_FAILED,
      );

    return categoryProduct;
  }

  async findProductsByCategoryId(categoryId: string): Promise<ProductEntity[]> {
    const category: CategoryEntity = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return category.products;
  }

  async associateProductsCategory(
    categoryId: string,
    products: ProductEntity[],
  ): Promise<CategoryEntity> {
    const category: CategoryEntity = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });

    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (const productData of products) {
      const product: ProductEntity = await this.productRepository.findOne({
        where: { id: productData.id },
      });
      if (!product)
        throw new BusinessLogicException(
          'The product with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    category.products = products;
    return await this.categoryRepository.save(category);
  }

  async deleteProductCategory(categoryId: string, productId: string) {
    const { category, product } = await this.findProductAndCategory(
      categoryId,
      productId,
    );

    const categoryProduct: ProductEntity = category.products.find(
      (e) => e.id === product.id,
    );
    if (!categoryProduct)
      throw new BusinessLogicException(
        'The product with the given id is not associated to the category',
        BusinessError.PRECONDITION_FAILED,
      );

    category.products = category.products.filter((e) => e.id !== productId);
    await this.categoryRepository.save(category);
  }

  private async findProductAndCategory(
    categoryId: string,
    productId: string,
  ): Promise<{ category: CategoryEntity; product: ProductEntity }> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const category: CategoryEntity = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return { category, product };
  }
}
