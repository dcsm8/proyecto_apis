import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulinaryCultureEntity } from './culinary-culture.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CulinaryCultureService {
  cacheKey: string = 'culinary-culture';

  constructor(
    @InjectRepository(CulinaryCultureEntity)
    private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CulinaryCultureEntity[]> {
    const cached: CulinaryCultureEntity[] = await this.cacheManager.get<
      CulinaryCultureEntity[]
    >(this.cacheKey);

    if (!cached) {
      const culinaryCultures: CulinaryCultureEntity[] =
        await this.culinaryCultureRepository.find({
          relations: ['countries', 'products', 'recipes', 'restaurants'],
        });
      await this.cacheManager.set(this.cacheKey, culinaryCultures);
      return culinaryCultures;
    }

    return cached;
  }

  async findOne(id: string): Promise<CulinaryCultureEntity> {
    const culinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({
        where: { id },
        relations: ['countries', 'products', 'recipes', 'restaurants'],
      });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return culinaryCulture;
  }

  async create(
    culinaryCulture: CulinaryCultureEntity,
  ): Promise<CulinaryCultureEntity> {
    return await this.culinaryCultureRepository.save(culinaryCulture);
  }

  async update(
    id: string,
    culinaryCulture: CulinaryCultureEntity,
  ): Promise<CulinaryCultureEntity> {
    const persistedCulinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({ where: { id } });
    if (!persistedCulinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.culinaryCultureRepository.save({
      ...persistedCulinaryCulture,
      ...culinaryCulture,
    });
  }

  async updateSonar(
    id: string,
    culinaryCulture: CulinaryCultureEntity,
  ): Promise<CulinaryCultureEntity> {
    const persistedCulinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({ where: { id } });
    if (!persistedCulinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.culinaryCultureRepository.save({
      ...persistedCulinaryCulture,
      ...culinaryCulture,
    });
  }

  async delete(id: string) {
    const culinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({ where: { id } });
    if (!culinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.culinaryCultureRepository.remove(culinaryCulture);
  }
}
