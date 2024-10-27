import { Module } from '@nestjs/common';
import { CategoryProductService } from './category-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';
import { CategoryProductController } from './category-product.controller';
import { CategoryProductResolver } from './category-product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  providers: [CategoryProductService, CategoryProductResolver],
  controllers: [CategoryProductController],
})
export class CategoryProductModule {}
