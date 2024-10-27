import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { CulinaryCultureRestaurantService } from './culinary-culture-restaurant.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CulinaryCultureRestaurantController } from './culinary-culture-restaurant.controller';
import { CulinaryCultureRestaurantResolver } from './culinary-culture-restaurant.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([CulinaryCultureEntity, RestaurantEntity]),
    CacheModule.register(),
  ],
  providers: [
    CulinaryCultureRestaurantService,
    CulinaryCultureRestaurantResolver,
  ],
  exports: [CulinaryCultureRestaurantService],
  controllers: [CulinaryCultureRestaurantController],
})
export class CulinaryCultureRestaurantModule {}
