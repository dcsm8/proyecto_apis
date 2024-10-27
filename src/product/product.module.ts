import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), CacheModule.register()],
  providers: [ProductService, ProductResolver],
  controllers: [ProductController]
})
export class ProductModule {}
