import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulinaryCultureCountryService } from './culinary-culture-country.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { CountryEntity } from '../country/country.entity';

@Resolver(() => CulinaryCultureEntity)
export class CulinaryCultureCountryResolver {
    constructor(private culinaryCultureCountryService: CulinaryCultureCountryService) {}

    @Mutation(() => CulinaryCultureEntity)
    addCountryToCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('countryId') countryId: string
    ): Promise<CulinaryCultureEntity> {
        return this.culinaryCultureCountryService.addCountryCulinaryCulture(culinaryCultureId, countryId);
    }

    @Query(() => CountryEntity)
    findCountryByCulinaryCultureIdCountryId(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('countryId') countryId: string
    ): Promise<CountryEntity> {
        return this.culinaryCultureCountryService.findCountryByCulinaryCultureIdCountryId(culinaryCultureId, countryId);
    }

    @Query(() => [CountryEntity])
    findCountriesByCulinaryCultureId(
        @Args('culinaryCultureId') culinaryCultureId: string
    ): Promise<CountryEntity[]> {
        return this.culinaryCultureCountryService.findCountriesByCulinaryCultureId(culinaryCultureId);
    }

    @Query(() => [CulinaryCultureEntity])
    findCulinaryCulturesByCountryId(
        @Args('countryId') countryId: string
    ): Promise<CulinaryCultureEntity[]> {
        return this.culinaryCultureCountryService.findCulinaryCulturesByCountryId(countryId);
    }

    @Mutation(() => CulinaryCultureEntity)
    associateCountriesToCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('countriesIds', { type: () => [String] }) countriesIds: string[]
    ): Promise<CulinaryCultureEntity> {
        const countries = countriesIds.map(id => ({ id } as CountryEntity));
        return this.culinaryCultureCountryService.associateCountriesCulinaryCulture(culinaryCultureId, countries);
    }

    @Mutation(() => CulinaryCultureEntity)
    deleteCountryFromCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('countryId') countryId: string
    ): Promise<void> {
        return this.culinaryCultureCountryService.deleteCountryCulinaryCulture(culinaryCultureId, countryId);
    }
}