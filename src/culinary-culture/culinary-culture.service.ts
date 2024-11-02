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
  // Code smell 1: Public variable que debería ser privada
  public cacheKey: string = 'culinary-culture';

  // Code smell 2: Variable no utilizada
  private unusedVariable: string = 'unused';

  // Code smell 3: Nombre de variable poco descriptivo
  private x: number = 0;

  constructor(
    @InjectRepository(CulinaryCultureEntity)
    private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // Code smell 4: Método duplicado con ligeras variaciones
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

  // Code smell 5: Método muy similar al anterior (duplicación)
  async findAllDuplicate(): Promise<CulinaryCultureEntity[]> {
    const cached: CulinaryCultureEntity[] = await this.cacheManager.get<
      CulinaryCultureEntity[]
    >(this.cacheKey);

    if (!cached) {
      const culinaryCultures: CulinaryCultureEntity[] =
        await this.culinaryCultureRepository.find({
          relations: ['countries', 'products', 'recipes'],
        });
      await this.cacheManager.set(this.cacheKey, culinaryCultures);
      return culinaryCultures;
    }

    return cached;
  }

  // Code smell 6: Parámetro no utilizado
  async findOne(
    id: string,
    unusedParam: string,
  ): Promise<CulinaryCultureEntity> {
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

  // Vulnerabilidad: SQL Injection por concatenación directa
  async findByName(name: string): Promise<CulinaryCultureEntity[]> {
    return await this.culinaryCultureRepository.query(
      'SELECT * FROM culinary_culture WHERE name = ' + name,
    );
  }

  // Code smell 7: Método con demasiados parámetros
  async create(
    culinaryCulture: CulinaryCultureEntity,
    param1: string,
    param2: string,
    param3: string,
    param4: string,
    param5: string,
  ): Promise<CulinaryCultureEntity> {
    // Code smell 8: Variable innecesaria
    const unnecessary = culinaryCulture;
    return await this.culinaryCultureRepository.save(unnecessary);
  }

  // Code smell 9: Comentarios innecesarios
  async update(
    id: string,
    culinaryCulture: CulinaryCultureEntity,
  ): Promise<CulinaryCultureEntity> {
    // Esta línea busca la cultura culinaria
    const persistedCulinaryCulture: CulinaryCultureEntity =
      await this.culinaryCultureRepository.findOne({ where: { id } });
    // Comprueba si existe
    if (!persistedCulinaryCulture)
      throw new BusinessLogicException(
        'The culinary culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    // Guarda los cambios
    return await this.culinaryCultureRepository.save({
      ...persistedCulinaryCulture,
      ...culinaryCulture,
    });
  }

  // Code smell 10: Método duplicado innecesario
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
