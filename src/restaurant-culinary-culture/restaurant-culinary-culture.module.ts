import { RestaurantCulinaryCultureResolver } from './restaurant-culinary-culture.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantCulinaryCultureService } from './restaurant-culinary-culture.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RestaurantCulinaryCultureController } from './restaurant-culinary-culture.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, CulinaryCultureEntity]),
    CacheModule.register(),
  ],
  providers: [
    RestaurantCulinaryCultureService,
    RestaurantCulinaryCultureResolver,
  ],
  exports: [RestaurantCulinaryCultureService],
  controllers: [RestaurantCulinaryCultureController],
})
export class RestaurantCulinaryCultureModule {}
