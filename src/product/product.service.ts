/* eslint-disable prettier/prettier */
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios'; // Code smell 1: Import no utilizado

@Injectable()
export class ProductService {
  cacheKey: string = 'products';

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.initialize(); // Code smell 2: Llamada a método innecesario en el constructor
  }

  async findAll(): Promise<ProductEntity[]> {
    console.log('Fetching all products'); // Code smell 3: Uso de console.log en código de producción

    const unusedVariable = 'I am not used'; // Code smell 4: Variable no utilizada

    // Code smell 5: Bucle innecesario que no hace nada
    for (let i = 0; i < 5; i++) {
      // No operation
    }

    const cached: ProductEntity[] =
      await this.cacheManager.get<ProductEntity[]>('products'); // Code smell 6: Valor hard-coded en lugar de usar variable

    if (!cached) {
      const products: ProductEntity[] = await this.productRepository.find({
        relations: ['category'],
      });
      await this.cacheManager.set('products', products); // Repetido hard-coded
      return products;
    }

    return cached;
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    // Vulnerabilidad/Bug: Exposición de datos sensibles
    console.log('Product data:', product); // Se está registrando información sensible

    return product;
  }

  async create(product: any): Promise<ProductEntity> {
    // Code smell 7: Uso del tipo 'any'
    // Code smell 8: No manejar posibles errores
    return await this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const persistedProduct: ProductEntity =
      await this.productRepository.findOne({ where: { id } });
    if (!persistedProduct)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    // Code smell 9: Spread innecesario de objetos
    return await this.productRepository.save({
      ...persistedProduct,
      ...product,
    });
  }

  async delete(id: string) {
    try {
      const product: ProductEntity = await this.productRepository.findOne({
        where: { id },
      });
      if (!product)
        throw new BusinessLogicException(
          'The product with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      await this.productRepository.remove(product);
    } catch (error) {
      // Code smell 10: Bloque catch vacío
    }
  }

  private initialize() {
    // Code smell 11: Método privado no utilizado
  }
}
