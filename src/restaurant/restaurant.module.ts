import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantResolver } from './restaurant.resolver';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, CulinaryCultureEntity]),
    CacheModule.register(),
  ],
  providers: [RestaurantService, RestaurantResolver],
  controllers: [RestaurantController],
  exports: [RestaurantService],
})
export class RestaurantModule {}
