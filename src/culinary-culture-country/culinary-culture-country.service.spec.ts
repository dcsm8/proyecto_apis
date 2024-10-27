import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { CulinaryCultureCountryService } from './culinary-culture-country.service';
import { faker } from '@faker-js/faker';

describe('CulinaryCultureCountryService', () => {
  let service: CulinaryCultureCountryService;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let countryRepository: Repository<CountryEntity>;
  let culinaryCulture: CulinaryCultureEntity;
  let countriesList: CountryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulinaryCultureCountryService],
    }).compile();

    service = module.get<CulinaryCultureCountryService>(CulinaryCultureCountryService);
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(getRepositoryToken(CulinaryCultureEntity));
    countryRepository = module.get<Repository<CountryEntity>>(getRepositoryToken(CountryEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    countryRepository.clear();
    culinaryCultureRepository.clear();

    countriesList = [];
    for (let i = 0; i < 5; i++) {
      const country: CountryEntity = await countryRepository.save({
        name: faker.location.country()
      })
      countriesList.push(country);
    }

    culinaryCulture = await culinaryCultureRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      countries: [countriesList[0]]
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCountryCulinaryCulture should add a country to a culinary culture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country()
    });
    const updatedCulinaryCulture: CulinaryCultureEntity = await service.addCountryCulinaryCulture(culinaryCulture.id, newCountry.id);
    expect(updatedCulinaryCulture.countries.length).toBe(2);
    expect(updatedCulinaryCulture.countries.some(country => country.id === newCountry.id)).toBeTruthy();
  });
  
  it('findCountryByCulinaryCultureIdCountryId should return country by culinary culture and country id', async () => {
    const storedCountry: CountryEntity = countriesList[0];
    const country: CountryEntity = await service.findCountryByCulinaryCultureIdCountryId(culinaryCulture.id, storedCountry.id);
    expect(country).not.toBeNull();
    expect(country.name).toBe(storedCountry.name);
  });
  
  it('findCountryByCulinaryCultureIdCountryId should throw an exception for an invalid country', async () => {
    await expect(() => service.findCountryByCulinaryCultureIdCountryId(culinaryCulture.id, "0")).rejects.toHaveProperty("message", "The country with the given id was not found");
  });
  
  it('findCountriesByCulinaryCultureId should return all countries for a culinary culture', async () => {
    const countries: CountryEntity[] = await service.findCountriesByCulinaryCultureId(culinaryCulture.id);
    expect(countries.length).toBe(1);
  });
  
  it('findCulinaryCulturesByCountryId should return culinary cultures for a country', async () => {
    const country: CountryEntity = countriesList[0];
    const culinaryCultures: CulinaryCultureEntity[] = await service.findCulinaryCulturesByCountryId(country.id);
    expect(culinaryCultures).not.toBeNull();
    expect(culinaryCultures.length).toBe(1);
    expect(culinaryCultures[0].id).toBe(culinaryCulture.id);
  });

  it('findCulinaryCulturesByCountryId should throw an exception for an invalid country', async () => {
    await expect(() => service.findCulinaryCulturesByCountryId("0")).rejects.toHaveProperty("message", "The country with the given id was not found");
  });

  it('findCulinaryCulturesByCountryId should return an empty array for a country with no culinary cultures', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country()
    });
    const culinaryCultures: CulinaryCultureEntity[] = await service.findCulinaryCulturesByCountryId(newCountry.id);
    expect(culinaryCultures).toHaveLength(0);
  });

  it('associateCountriesCulinaryCulture should update countries list for a culinary culture', async () => {
    const newCountriesList = [countriesList[1], countriesList[2]];

    const updatedCulinaryCulture: CulinaryCultureEntity = await service.associateCountriesCulinaryCulture(culinaryCulture.id, newCountriesList);
    expect(updatedCulinaryCulture.countries.length).toBe(2);
    expect(updatedCulinaryCulture.countries.some(country => country.id === newCountriesList[0].id)).toBeTruthy();
    expect(updatedCulinaryCulture.countries.some(country => country.id === newCountriesList[1].id)).toBeTruthy();
  });
  
  it('deleteCountryCulinaryCulture should remove a country from a culinary culture', async () => {
    const country: CountryEntity = countriesList[0];

    await service.deleteCountryCulinaryCulture(culinaryCulture.id, country.id);

    const storedCulinaryCulture: CulinaryCultureEntity = await culinaryCultureRepository.findOne({ where: { id: culinaryCulture.id }, relations: ["countries"] });
    const deletedCountry: CountryEntity = storedCulinaryCulture.countries.find(a => a.id === country.id);

    expect(deletedCountry).toBeUndefined();
  });
  
  it('deleteCountryCulinaryCulture should throw an exception for a non-associated country', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country()
    });

    await expect(() => service.deleteCountryCulinaryCulture(culinaryCulture.id, newCountry.id)).rejects.toHaveProperty("message", "The country with the given id is not associated to the culinary culture");
  });
});