import { Module } from '@nestjs/common';
import { CulinaryCultureCountryService } from './culinary-culture-country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { CulinaryCultureCountryController } from './culinary-culture-country.controller';
import { CulinaryCultureCountryResolver } from './culinary-culture-country.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulinaryCultureEntity, CountryEntity])],
  providers: [CulinaryCultureCountryService, CulinaryCultureCountryResolver],
  controllers: [CulinaryCultureCountryController],
})
export class CulinaryCultureCountryModule {}
