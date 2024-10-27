import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CountryService } from './country.service';
import { CountryEntity } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';
import { CountryResolver } from './country.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity]), CacheModule.register()],
  providers: [CountryService, CountryResolver],
  controllers: [CountryController]
})
export class CountryModule {}
