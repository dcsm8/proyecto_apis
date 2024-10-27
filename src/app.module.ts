import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CulinaryCultureModule } from './culinary-culture/culinary-culture.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProductEntity } from './product/product.entity';
import { CategoryEntity } from './category/category.entity';
import { CulinaryCultureEntity } from './culinary-culture/culinary-culture.entity';
import { CountryEntity } from './country/country.entity';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { RecipeEntity } from './recipe/recipe.entity';
import { CountryModule } from './country/country.module';
import { RecipeModule } from './recipe/recipe.module';
import { CulinaryCultureCountryModule } from './culinary-culture-country/culinary-culture-country.module';
import { CulinaryCultureRecipeModule } from './culinary-culture-recipe/culinary-culture-recipe.module';
import { RecipeProductModule } from './recipe-product/recipe-product.module';
import { CategoryProductModule } from './category-product/category-product.module';
import { CulinaryCultureProductModule } from './culinary-culture-product/culinary-culture-product.module';
import { CulinaryCultureRestaurantModule } from './culinary-culture-restaurant/culinary-culture-restaurant.module';
import { CountryCulinaryCultureModule } from './country-culinary-culture/country-culinary-culture.module';
import { RestaurantCulinaryCultureModule } from './restaurant-culinary-culture/restaurant-culinary-culture.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          CategoryEntity,
          CountryEntity,
          CulinaryCultureEntity,
          ProductEntity,
          RecipeEntity,
          RestaurantEntity,
        ],
        dropSchema: configService.get('NODE_ENV') === 'test',
        synchronize: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),
    CategoryModule,
    CountryModule,
    CulinaryCultureModule,
    ProductModule,
    RecipeModule,
    RestaurantModule,
    CulinaryCultureCountryModule,
    CulinaryCultureRecipeModule,
    RecipeProductModule,
    CategoryProductModule,
    CulinaryCultureProductModule,
    CulinaryCultureRestaurantModule,
    CountryCulinaryCultureModule,
    RestaurantCulinaryCultureModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
