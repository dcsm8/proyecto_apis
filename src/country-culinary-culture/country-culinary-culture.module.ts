import { Module } from '@nestjs/common';
import { CountryCulinaryCultureService } from './country-culinary-culture.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { CountryCulinaryCultureController } from './country-culinary-culture.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulinaryCultureEntity, CountryEntity])],
  providers: [CountryCulinaryCultureService],
  controllers: [CountryCulinaryCultureController],
})
export class CountryCulinaryCultureModule {}