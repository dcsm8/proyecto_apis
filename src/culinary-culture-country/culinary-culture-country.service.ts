import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from '../country/country.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CulinaryCultureCountryService {
    constructor(
        @InjectRepository(CulinaryCultureEntity)
        private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,
     
        @InjectRepository(CountryEntity)
        private readonly countryRepository: Repository<CountryEntity>
    ) {}

    async addCountryCulinaryCulture(culinaryCultureId: string, countryId: string): Promise<CulinaryCultureEntity> {
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}});
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND);
       
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["countries"]}) 
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND);
        
        if (culinaryCulture.countries.some(c => c.id === country.id)) {
          throw new BusinessLogicException("The country already exists in the culinary culture", BusinessError.PRECONDITION_FAILED);
        }

        culinaryCulture.countries = [...culinaryCulture.countries, country];
        return await this.culinaryCultureRepository.save(culinaryCulture);
    }
     
    async findCountryByCulinaryCultureIdCountryId(culinaryCultureId: string, countryId: string): Promise<CountryEntity> {
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}, relations: ["culinaryCultures"] });
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
        
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["countries"]}); 
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
    
        const culinaryCultureCountry: CountryEntity = culinaryCulture.countries.find(e => e.id === country.id);
    
        if (!culinaryCultureCountry)
          throw new BusinessLogicException("The country with the given id is not associated to the culinary culture", BusinessError.PRECONDITION_FAILED)
    
        return country;
    }
     
    async findCountriesByCulinaryCultureId(culinaryCultureId: string): Promise<CountryEntity[]> {
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["countries"]});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
        
        return culinaryCulture.countries;
    }
    
    async findCulinaryCulturesByCountryId(countryId: string): Promise<CulinaryCultureEntity[]> {
      const country: CountryEntity = await this.countryRepository.findOne({
          where: { id: countryId },
          relations: ["culinaryCultures"]
      });

      if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND);

      return country.culinaryCultures;
    }

    async associateCountriesCulinaryCulture(culinaryCultureId: string, countries: CountryEntity[]): Promise<CulinaryCultureEntity> {
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["countries"]});
     
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
     
        for (const element of countries) {
          const country: CountryEntity = await this.countryRepository.findOne({where: {id: element.id}});
          if (!country)
            throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        culinaryCulture.countries = countries;
        return await this.culinaryCultureRepository.save(culinaryCulture);
    }
     
    async deleteCountryCulinaryCulture(culinaryCultureId: string, countryId: string){
        const country: CountryEntity = await this.countryRepository.findOne({where: {id: countryId}});
        if (!country)
          throw new BusinessLogicException("The country with the given id was not found", BusinessError.NOT_FOUND)
     
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["countries"]});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
     
        const culinaryCultureCountry: CountryEntity = culinaryCulture.countries.find(e => e.id === country.id);
     
        if (!culinaryCultureCountry)
            throw new BusinessLogicException("The country with the given id is not associated to the culinary culture", BusinessError.PRECONDITION_FAILED)

        culinaryCulture.countries = culinaryCulture.countries.filter(e => e.id !== countryId);
        await this.culinaryCultureRepository.save(culinaryCulture);
    }   
}