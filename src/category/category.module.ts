import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CacheModule } from '@nestjs/cache-manager';
import { CategoryResolver } from './category.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), CacheModule.register()],
  providers: [CategoryService, CategoryResolver],
  controllers: [CategoryController],
})
export class CategoryModule {}
