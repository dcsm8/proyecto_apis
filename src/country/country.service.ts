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
    const cached: CountryEntity[] = await this.cacheManager.get<
      CountryEntity[]
    >(this.cacheKey);

    if (!cached) {
      const countries: CountryEntity[] = await this.countryRepository.find({
        relations: ['culinaryCultures'],
      });
      await this.cacheManager.set(this.cacheKey, countries);
      return countries;
    }

    return cached;
  }

  async findOne(id: string): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id },
      relations: ['culinaryCultures'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return country;
  }

  async create(country: CountryEntity): Promise<CountryEntity> {
    return await this.countryRepository.save(country);
  }

  async update(id: string, country: CountryEntity): Promise<CountryEntity> {
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
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id },
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.countryRepository.remove(country);
  }
}
