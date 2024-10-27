import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { ProductEntity } from '../product/product.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class CulinaryCultureProductService {
  constructor(
    @InjectRepository(CulinaryCultureEntity)
    private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async addProductCulinaryCulture(
    culinaryCultureId: string,
    productId: string,
  ): Promise<CulinaryCultureEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({
        where: { id: culinaryCultureId },
        relations: ['products'],
      });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinaryCulture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    culinaryCulture.products = [...culinaryCulture.products, product];
    return await this.culinaryCultureRepository.save(culinaryCulture);
  }

  async findProductByCulinaryCultureIdProductId(
    culinaryCultureId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const { culinaryCulture, product } =
      await this.findProductAndCulinaryCulture(culinaryCultureId, productId);

    const culinaryCultureProduct: ProductEntity = culinaryCulture.products.find(
      (e) => e.id === product.id,
    );

    if (!culinaryCultureProduct)
      throw new BusinessLogicException(
        'The product with the given id is not associated to the culinaryCulture',
        BusinessError.PRECONDITION_FAILED,
      );

    return culinaryCultureProduct;
  }

  async findProductsByCulinaryCultureId(
    culinaryCultureId: string,
  ): Promise<ProductEntity[]> {
    const culinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({
        where: { id: culinaryCultureId },
        relations: ['products'],
      });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinaryCulture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return culinaryCulture.products;
  }

  async associateProductsCulinaryCulture(
    culinaryCultureId: string,
    products: ProductEntity[],
  ): Promise<CulinaryCultureEntity> {
    const culinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({
        where: { id: culinaryCultureId },
        relations: ['products'],
      });

    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinaryCulture with the given id was not found',
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

    culinaryCulture.products = products;
    return await this.culinaryCultureRepository.save(culinaryCulture);
  }

  async deleteProductCulinaryCulture(
    culinaryCultureId: string,
    productId: string,
  ) {
    const { culinaryCulture, product } =
      await this.findProductAndCulinaryCulture(culinaryCultureId, productId);

    const culinaryCultureProduct: ProductEntity = culinaryCulture.products.find(
      (e) => e.id === product.id,
    );

    if (!culinaryCultureProduct)
      throw new BusinessLogicException(
        'The product with the given id is not associated to the culinaryCulture',
        BusinessError.PRECONDITION_FAILED,
      );

    culinaryCulture.products = culinaryCulture.products.filter(
      (e) => e.id !== productId,
    );
    await this.culinaryCultureRepository.save(culinaryCulture);
  }

  private async findProductAndCulinaryCulture(
    culinaryCultureId: string,
    productId: string,
  ): Promise<{
    culinaryCulture: CulinaryCultureEntity;
    product: ProductEntity;
  }> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const culinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({
        where: { id: culinaryCultureId },
        relations: ['products'],
      });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinaryCulture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return { culinaryCulture, product };
  }

  async findOne(id: string): Promise<CulinaryCultureEntity> {
    const culinaryCulture = await this.culinaryCultureRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return culinaryCulture;
  }
}
