import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryEntity } from '../../country/country.entity';
import { ProductEntity } from '../../product/product.entity';
import { CategoryEntity } from '../../category/category.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { CulinaryCultureEntity } from '../../culinary-culture/culinary-culture.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CulinaryCultureEntity,
      CountryEntity,
      ProductEntity,
      CategoryEntity,
      RestaurantEntity,
      RecipeEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CulinaryCultureEntity,
    CountryEntity,
    ProductEntity,
    CategoryEntity,
    RestaurantEntity,
    RecipeEntity,
  ]),
];
