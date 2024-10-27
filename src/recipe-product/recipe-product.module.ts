import { Module } from '@nestjs/common';
import { RecipeProductService } from './recipe-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';
import { ProductEntity } from '../product/product.entity';
import { RecipeProductController } from './recipe-product.controller';
import { RecipeProductResolver } from './recipe-product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, ProductEntity])],
  providers: [RecipeProductService, /*RecipeProductResolver*/],
  controllers: [RecipeProductController],
})
export class RecipeProductModule {}
