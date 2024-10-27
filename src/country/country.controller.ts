import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CountryDto } from './country.dto';
import { CountryEntity } from './country.entity';
import { CountryService } from './country.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('countries')
@UseInterceptors(BusinessErrorsInterceptor)

export class CountryController {
    constructor(private readonly countryService: CountryService) {}
   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get()
    async findAll() {
        return await this.countryService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.countryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post()
    async create(@Body() countryDto: CountryDto) {
        const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
        return await this.countryService.create(country);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':id')
    async update(@Param('id') id: string, @Body() countryDto: CountryDto) {
        const country: CountryEntity = plainToInstance(CountryEntity, countryDto);
        return await this.countryService.update(id, country);
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.countryService.delete(id);
    }
}

