import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from '../country/country.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CountryCulinaryCultureService {
    constructor(
        @InjectRepository(CountryEntity)
        private readonly countryRepository: Repository<CountryEntity>,
     
        @InjectRepository(CulinaryCultureEntity)
        private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>
    ) {}

    async addCulinaryCultureCountry(countryId: string, culinaryCultureId: string): Promise<CountryEntity> {
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND);
       
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["culinaryCultures"]}) 
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND);
        
        if (country.culinaryCultures.some(c => c.id === culinaryCulture.id)) {
          throw new BusinessLogicException("The culinary culture already exists in the country", BusinessError.PRECONDITION_FAILED);
        }

        country.culinaryCultures = [...country.culinaryCultures, culinaryCulture];
        return await this.countryRepository.save(country);
    }
     
    async findCulinaryCultureByCountryIdCulinaryCultureId(countryId: string, culinaryCultureId: string): Promise<CulinaryCultureEntity> {
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ['countries', 'products', 'recipes', 'restaurants'],});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
        
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["culinaryCultures"]}); 
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
    
        const countryCulinaryCulture: CulinaryCultureEntity = country.culinaryCultures.find(e => e.id === culinaryCulture.id);
    
        if (!countryCulinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id is not associated to the country", BusinessError.PRECONDITION_FAILED)
    
        return culinaryCulture;
    }
     
    async findCulinaryCulturesByCountryId(countryId: string): Promise<CulinaryCultureEntity[]> {
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["culinaryCultures"]});
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
        
        return country.culinaryCultures;
    }
     
    async associateCulinaryCulturesCountry(countryId: string, culinaryCultures: CulinaryCultureEntity[]): Promise<CountryEntity> {
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["culinaryCultures"]});
     
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
     
        for (const element of culinaryCultures) {
          const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: element.id}});
          if (!culinaryCulture)
            throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        country.culinaryCultures = culinaryCultures;
        return await this.countryRepository.save(country);
    }
     
    async deleteCulinaryCultureCountry(countryId: string, culinaryCultureId: string){
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
     
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["culinaryCultures"]});
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
     
        const countryCulinaryCulture: CulinaryCultureEntity = country.culinaryCultures.find(e => e.id === culinaryCulture.id);
     
        if (!countryCulinaryCulture)
            throw new BusinessLogicException("The culinary culture with the given id is not associated to the country", BusinessError.PRECONDITION_FAILED)

        country.culinaryCultures = country.culinaryCultures.filter(e => e.id !== culinaryCultureId);
        await this.countryRepository.save(country);
    }   
}