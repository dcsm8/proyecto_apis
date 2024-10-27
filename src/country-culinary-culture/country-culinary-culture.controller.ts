import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { CulinaryCultureDto } from '../culinary-culture/culinary-culture.dto';
import { CountryCulinaryCultureService } from './country-culinary-culture.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('countries')
@UseInterceptors(BusinessErrorsInterceptor)
export class CountryCulinaryCultureController {
    constructor(private readonly countryCulinaryCultureService: CountryCulinaryCultureService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post(':countryId/culinary-cultures/:culinaryCultureId')
    async addCulinaryCultureCountry(@Param('countryId') countryId: string, @Param('culinaryCultureId') culinaryCultureId: string) {
        return await this.countryCulinaryCultureService.addCulinaryCultureCountry(countryId, culinaryCultureId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':countryId/culinary-cultures/:culinaryCultureId')
    async findCulinaryCultureByCountryIdCulinaryCultureId(@Param('countryId') countryId: string, @Param('culinaryCultureId') culinaryCultureId: string) {
        return await this.countryCulinaryCultureService.findCulinaryCultureByCountryIdCulinaryCultureId(countryId, culinaryCultureId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':countryId/culinary-cultures')
    async findCulinaryCulturesByCountryId(@Param('countryId') countryId: string) {
        return await this.countryCulinaryCultureService.findCulinaryCulturesByCountryId(countryId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':countryId/culinary-cultures')
    async associateCulinaryCulturesCountry(@Body() culinaryCulturesDto: CulinaryCultureDto[], @Param('countryId') countryId: string) {
        const culinaryCultures = plainToInstance(CulinaryCultureEntity, culinaryCulturesDto);
        return await this.countryCulinaryCultureService.associateCulinaryCulturesCountry(countryId, culinaryCultures);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':countryId/culinary-cultures/:culinaryCultureId')
    @HttpCode(204)
    async deleteCulinaryCultureCountry(@Param('countryId') countryId: string, @Param('culinaryCultureId') culinaryCultureId: string) {
        return await this.countryCulinaryCultureService.deleteCulinaryCultureCountry(countryId, culinaryCultureId);
    }
}