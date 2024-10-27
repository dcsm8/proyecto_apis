import { Injectable, Inject } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {BusinessError, BusinessLogicException} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CategoryService {

  cacheKey: string = "categories";

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    const cached: CategoryEntity[] = await this.cacheManager.get<CategoryEntity[]>(this.cacheKey);

    if(!cached){
      const categories: CategoryEntity[] = await await this.categoryRepository.find({ relations: ['products'] });
      await this.cacheManager.set(this.cacheKey, categories);
      return categories;
    }

    return cached; 
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const category: CategoryEntity = await this.categoryRepository.findOne({ where: { id }, relations: ['products'] });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return category;
  }

  async create(category: CategoryEntity): Promise<CategoryEntity> {
    return await this.categoryRepository.save(category);
  }

  async update(id: string, category: CategoryEntity): Promise<CategoryEntity> {
    const persistedCategory: CategoryEntity =
      await this.categoryRepository.findOne({ where: { id } });
    if (!persistedCategory)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.categoryRepository.save({
      ...persistedCategory,
      ...category,
    });
  }

  async delete(id: string) {
    const category: CategoryEntity = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.categoryRepository.remove(category);
  }
}
