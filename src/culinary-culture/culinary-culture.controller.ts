import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulinaryCultureDto } from './culinary-culture.dto';
import { CulinaryCultureEntity } from './culinary-culture.entity';
import { CulinaryCultureService } from './culinary-culture.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('culinary-cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulinaryCultureController {
    constructor(private readonly culinaryCultureService: CulinaryCultureService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get()
    async findAll() {
        return await this.culinaryCultureService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.culinaryCultureService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post()
    async create(@Body() culinaryCultureDto: CulinaryCultureDto) {
        const culinaryCulture: CulinaryCultureEntity = plainToInstance(CulinaryCultureEntity, culinaryCultureDto);
        return await this.culinaryCultureService.create(culinaryCulture);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':id')
    async update(@Param('id') id: string, @Body() culinaryCultureDto: CulinaryCultureDto) {
        const culinaryCulture: CulinaryCultureEntity = plainToInstance(CulinaryCultureEntity, culinaryCultureDto);
        return await this.culinaryCultureService.update(id, culinaryCulture);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.culinaryCultureService.delete(id);
    }
}