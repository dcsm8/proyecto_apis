import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecipeEntity } from '../recipe/recipe.entity';
import { RecipeDto } from '../recipe/recipe.dto';
import { CulinaryCultureRecipeService } from './culinary-culture-recipe.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('culinary-cultures')
@UseInterceptors(BusinessErrorsInterceptor)

export class CulinaryCultureRecipeController {
    constructor(private readonly culinaryCultureRecipeService: CulinaryCultureRecipeService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post(':culinaryCultureId/recipes')
    async addRecipeCulinaryCulture(@Param('culinaryCultureId') culinaryCultureId: string, @Body() recipeDto: RecipeDto) {
        const recipe: RecipeEntity = plainToInstance(RecipeEntity, recipeDto);
        return await this.culinaryCultureRecipeService.addRecipeCulinaryCulture(culinaryCultureId, recipe);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':culinaryCultureId/recipes/:recipeId')
    async findRecipeByCulinaryCultureIdRecipeId(@Param('culinaryCultureId') culinaryCultureId: string, @Param('recipeId') recipeId: string) {
        return await this.culinaryCultureRecipeService.findRecipeByCulinaryCultureIdRecipeId(culinaryCultureId, recipeId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':culinaryCultureId/recipes')
    async findRecipesByCulinaryCultureId(@Param('culinaryCultureId') culinaryCultureId: string) {
        return await this.culinaryCultureRecipeService.findRecipesByCulinaryCultureId(culinaryCultureId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':culinaryCultureId/recipes')
    async associateRecipesCulinaryCulture(@Body() recipesDto: RecipeDto[], @Param('culinaryCultureId') culinaryCultureId: string) {
        const recipes = plainToInstance(RecipeEntity, recipesDto);
        return await this.culinaryCultureRecipeService.associateRecipesCulinaryCulture(culinaryCultureId, recipes);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':culinaryCultureId/recipes/:recipeId')
    @HttpCode(204)
    async deleteRecipeCulinaryCulture(@Param('culinaryCultureId') culinaryCultureId: string, @Param('recipeId') recipeId: string) {
        return await this.culinaryCultureRecipeService.deleteRecipeCulinaryCulture(culinaryCultureId, recipeId);
    }
}