import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecipeDto } from './recipe.dto';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('recipes')
@UseInterceptors(BusinessErrorsInterceptor)

export class RecipeController {

    constructor(private readonly recipeService: RecipeService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get()
    async findAll() {
        return await this.recipeService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.recipeService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post()
    async create(@Body() recipeDto: RecipeDto) {
        const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
        return await this.recipeService.create(recipe);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':id')
    async update(@Param('id') id: string, @Body() recipeDto: RecipeDto) {
        const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
        return await this.recipeService.update(id, recipe);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        return await this.recipeService.delete(id);
    }
}