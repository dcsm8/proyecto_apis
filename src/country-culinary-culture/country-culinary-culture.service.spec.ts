import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { CountryCulinaryCultureService } from './country-culinary-culture.service';
import { faker } from '@faker-js/faker';

describe('CountryCulinaryCultureService', () => {
  let service: CountryCulinaryCultureService;
  let culinaryCultureRepository: Repository<CulinaryCultureEntity>;
  let countryRepository: Repository<CountryEntity>;
  let country: CountryEntity;
  let culinaryCulturesList: CulinaryCultureEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryCulinaryCultureService],
    }).compile();

    service = module.get<CountryCulinaryCultureService>(CountryCulinaryCultureService);
    culinaryCultureRepository = module.get<Repository<CulinaryCultureEntity>>(getRepositoryToken(CulinaryCultureEntity));
    countryRepository = module.get<Repository<CountryEntity>>(getRepositoryToken(CountryEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    countryRepository.clear();
    culinaryCultureRepository.clear();

    culinaryCulturesList = [];
    for (let i = 0; i < 5; i++) {
      const culinaryCulture: CulinaryCultureEntity = await culinaryCultureRepository.save({
        name: faker.lorem.word(),
        description: faker.lorem.sentence()
      })
      culinaryCulturesList.push(culinaryCulture);
    }

    country = await countryRepository.save({
      name: faker.location.country(),
      culinaryCultures: [culinaryCulturesList[0]]
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulinaryCultureCountry should add a culinary culture to a country', async () => {
    const newCulinaryCulture: CulinaryCultureEntity = await culinaryCultureRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });
    const updatedCountry: CountryEntity = await service.addCulinaryCultureCountry(country.id, newCulinaryCulture.id);
    expect(updatedCountry.culinaryCultures.length).toBe(2);
    expect(updatedCountry.culinaryCultures.some(cc => cc.id === newCulinaryCulture.id)).toBeTruthy();
  });

  it('findCulinaryCultureByCountryIdCulinaryCultureId should return culinary culture by country and culinary culture id', async () => {
    const storedCulinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];
    const culinaryCulture: CulinaryCultureEntity = await service.findCulinaryCultureByCountryIdCulinaryCultureId(country.id, storedCulinaryCulture.id);
    expect(culinaryCulture).not.toBeNull();
    expect(culinaryCulture.name).toBe(storedCulinaryCulture.name);
  });

  it('findCulinaryCultureByCountryIdCulinaryCultureId should throw an exception for an invalid culinary culture', async () => {
    await expect(() => service.findCulinaryCultureByCountryIdCulinaryCultureId(country.id, "0")).rejects.toHaveProperty("message", "The culinary culture with the given id was not found");
  });

  it('findCulinaryCulturesByCountryId should return all culinary cultures for a country', async () => {
    const culinaryCultures: CulinaryCultureEntity[] = await service.findCulinaryCulturesByCountryId(country.id);
    expect(culinaryCultures.length).toBe(1);
  });

  it('associateCulinaryCulturesCountry should update culinary cultures list for a country', async () => {
    const newCulinaryCulturesList = [culinaryCulturesList[1], culinaryCulturesList[2]];

    const updatedCountry: CountryEntity = await service.associateCulinaryCulturesCountry(country.id, newCulinaryCulturesList);
    expect(updatedCountry.culinaryCultures.length).toBe(2);
    expect(updatedCountry.culinaryCultures.some(cc => cc.id === newCulinaryCulturesList[0].id)).toBeTruthy();
    expect(updatedCountry.culinaryCultures.some(cc => cc.id === newCulinaryCulturesList[1].id)).toBeTruthy();
  });

  it('deleteCulinaryCultureCountry should remove a culinary culture from a country', async () => {
    const culinaryCulture: CulinaryCultureEntity = culinaryCulturesList[0];

    await service.deleteCulinaryCultureCountry(country.id, culinaryCulture.id);

    const storedCountry: CountryEntity = await countryRepository.findOne({ where: { id: country.id }, relations: ["culinaryCultures"] });
    const deletedCulinaryCulture: CulinaryCultureEntity = storedCountry.culinaryCultures.find(cc => cc.id === culinaryCulture.id);

    expect(deletedCulinaryCulture).toBeUndefined();
  });

  it('deleteCulinaryCultureCountry should throw an exception for a non-associated culinary culture', async () => {
    const newCulinaryCulture: CulinaryCultureEntity = await culinaryCultureRepository.save({
      name: faker.lorem.word(),
      description: faker.lorem.sentence()
    });

    await expect(() => service.deleteCulinaryCultureCountry(country.id, newCulinaryCulture.id)).rejects.toHaveProperty("message", "The culinary culture with the given id is not associated to the country");
  });
});