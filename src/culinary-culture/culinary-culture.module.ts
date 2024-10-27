import { Module } from '@nestjs/common';
import { CulinaryCultureService } from './culinary-culture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulinaryCultureEntity } from './culinary-culture.entity';
import { CulinaryCultureController } from './culinary-culture.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { CulinaryCultureResolver } from './culinary-culture.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulinaryCultureEntity]), CacheModule.register()],
  providers: [CulinaryCultureService, CulinaryCultureResolver],
  controllers: [CulinaryCultureController],
})
export class CulinaryCultureModule {}
