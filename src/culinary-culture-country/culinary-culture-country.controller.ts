import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CountryEntity } from '../country/country.entity';
import { CountryDto } from '../country/country.dto';
import { CulinaryCultureCountryService } from './culinary-culture-country.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';


@Controller('culinary-cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulinaryCultureCountryController {
    constructor(private readonly culinaryCultureCountryService: CulinaryCultureCountryService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post(':culinaryCultureId/countries/:countryId')
    async addCountryCulinaryCulture(@Param('culinaryCultureId') culinaryCultureId: string, @Param('countryId') countryId: string) {
        return await this.culinaryCultureCountryService.addCountryCulinaryCulture(culinaryCultureId, countryId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':culinaryCultureId/countries/:countryId')
    async findCountryByCulinaryCultureIdCountryId(@Param('culinaryCultureId') culinaryCultureId: string, @Param('countryId') countryId: string) {
        return await this.culinaryCultureCountryService.findCountryByCulinaryCultureIdCountryId(culinaryCultureId, countryId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':culinaryCultureId/countries')
    async findCountriesByCulinaryCultureId(@Param('culinaryCultureId') culinaryCultureId: string) {
        return await this.culinaryCultureCountryService.findCountriesByCulinaryCultureId(culinaryCultureId);
    }
 
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get('countries/:countryId')
    async findCulinaryCulturesByCountryId(@Param('countryId') countryId: string) {
        return await this.culinaryCultureCountryService.findCulinaryCulturesByCountryId(countryId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':culinaryCultureId/countries')
    async associateCountriesCulinaryCulture(@Body() countriesDto: CountryDto[], @Param('culinaryCultureId') culinaryCultureId: string) {
        const countries = plainToInstance(CountryEntity, countriesDto);
        return await this.culinaryCultureCountryService.associateCountriesCulinaryCulture(culinaryCultureId, countries);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':culinaryCultureId/countries/:countryId')
    @HttpCode(204)
    async deleteCountryCulinaryCulture(@Param('culinaryCultureId') culinaryCultureId: string, @Param('countryId') countryId: string) {
        return await this.culinaryCultureCountryService.deleteCountryCulinaryCulture(culinaryCultureId, countryId);
    }
}