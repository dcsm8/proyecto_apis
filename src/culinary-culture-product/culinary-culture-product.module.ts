import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulinaryCultureProductService } from './culinary-culture-product.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { ProductEntity } from '../product/product.entity';
import { CulinaryCultureProductController } from './culinary-culture-product.controller';
import { CulinaryCultureProductResolver } from './culinary-culture-product.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulinaryCultureEntity, ProductEntity])],
  providers: [CulinaryCultureProductService, CulinaryCultureProductResolver],
  controllers: [CulinaryCultureProductController],
})
export class CulinaryCultureProductModule {}
