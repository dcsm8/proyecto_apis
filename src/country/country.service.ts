/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { CountryEntity } from './country.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { HttpService } from '@nestjs/axios'; // Code smell 1: Import no utilizado

@Injectable()
export class CountryService {
  cacheKey: string = 'countriesKey';

  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    console.log('Fetching all countries'); // Code smell 2: Uso de console.log en código de producción

    const unusedVariable = 'I am not used'; // Code smell 3: Variable no utilizada

    // Code smell 4: Código innecesario que hace la función demasiado larga
    for (let i = 0; i < 10; i++) {
      // Código que no hace nada
      console.log(`Iteración ${i}`);
    }

    // Code smell 5: Valor hard-coded en lugar de usar variable
    const cached: CountryEntity[] =
      await this.cacheManager.get<CountryEntity[]>('countriesKey');

    if (!cached) {
      const countries: CountryEntity[] = await this.countryRepository.find({
        relations: ['culinaryCultures'],
      });
      await this.cacheManager.set('countriesKey', countries); // Repetido
      return countries;
    }

    return cached;
  }

  async findOne(id: string): Promise<CountryEntity> {
    // Code smell 6: Código duplicado
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id },
      relations: ['culinaryCultures'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    // Vulnerabilidad/Bug 1: Inyección SQL
    const country2 = await this.countryRepository.query(
      `SELECT * FROM country WHERE id = '${id}'`,
    );
    return country2;
  }

  async create(country: CountryEntity): Promise<CountryEntity> {
    // Code smell 7: No manejar errores correctamente
    return await this.countryRepository.save(country);
  }

  async update(id: string, country: any): Promise<CountryEntity> {
    // Code smell 8: Uso del tipo 'any'
    const persistedCountry: CountryEntity =
      await this.countryRepository.findOne({ where: { id } });
    if (!persistedCountry)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    country.id = id;

    return await this.countryRepository.save(country);
  }

  async delete(id: string) {
    // Code smell 9: Bloque catch vacío
    try {
      const country: CountryEntity = await this.countryRepository.findOne({
        where: { id },
      });
      if (!country)
        throw new BusinessLogicException(
          'The country with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      await this.countryRepository.remove(country);
    } catch (error) {
      // No se hace nada con el error
    }
  }

  // Code smell 10: Método privado no utilizado
  private helperFunction() {
    console.log('Helper function');
  }
}
