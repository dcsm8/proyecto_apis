import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';

@Resolver()
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query(() => [CountryEntity])
    countries(): Promise<CountryEntity[]> {
        return this.countryService.findAll();
    }

    @Query(() => CountryEntity)
    country(@Args('id') id: string): Promise<CountryEntity> {
        return this.countryService.findOne(id);
    }

    @Mutation(() => CountryEntity)
    createCountry(@Args('country') countryDto: CountryDto): Promise<CountryEntity> {
        const country = plainToInstance(CountryEntity, countryDto);
        return this.countryService.create(country);
    }

    @Mutation(() => CountryEntity)
    updateCountry(@Args('id') id: string, @Args('country') countryDto: CountryDto): Promise<CountryEntity> {
        const country = plainToInstance(CountryEntity, countryDto);
        return this.countryService.update(id, country);
    }

    @Mutation(() => String)
    deleteCountry(@Args('id') id: string) {
        this.countryService.delete(id);
        return id;
    }
}