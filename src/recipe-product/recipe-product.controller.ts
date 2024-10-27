import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductEntity } from '../product/product.entity';
import { ProductDto } from '../product/product.dto';
import { RecipeProductService } from './recipe-product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('recipes')
@UseInterceptors(BusinessErrorsInterceptor)

export class RecipeProductController {
    
    constructor(private readonly recipeProductService: RecipeProductService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Post(':recipeId/products/:productId')
    async addProductToRecipe(@Param('recipeId') recipeId: string, @Param('productId') productId: string) {
        return await this.recipeProductService.addProductToRecipe(recipeId, productId);
    }
   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':recipeId/products/:productId')
    async findProductByRecipeIdProductId(@Param('recipeId') recipeId: string, @Param('productId') productId: string) {
        return await this.recipeProductService.findProductByRecipeIdProductId(recipeId, productId);
    }
   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get(':recipeId/products')
    async findProductsByRecipeId(@Param('recipeId') recipeId: string) {
        return await this.recipeProductService.findProductsByRecipeId(recipeId);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGER, Role.ADMIN)
    @Put(':recipeId/products')
    async associateProductsRecipe(@Body() productsDto: ProductDto[], @Param('recipeId') recipeId: string) {
        const products = plainToInstance(ProductEntity, productsDto);
        return await this.recipeProductService.associateProductsRecipe(recipeId, products);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DELETOR, Role.ADMIN)
    @Delete(':recipeId/products/:productId')
    @HttpCode(204)
    async deleteProductRecipe(@Param('recipeId') recipeId: string, @Param('productId') productId: string) {
        return await this.recipeProductService.deleteProductRecipe(recipeId, productId);
    }
}