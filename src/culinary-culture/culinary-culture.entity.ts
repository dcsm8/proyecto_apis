import { RecipeEntity } from '../recipe/recipe.entity';
import { CountryEntity } from '../country/country.entity';
import { ProductEntity } from '../product/product.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulinaryCultureEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field((type) => [CountryEntity])
  @ManyToMany(() => CountryEntity, (country) => country.culinaryCultures)
  @JoinTable()
  countries: CountryEntity[];

  @Field((type) => [ProductEntity])
  @ManyToMany(() => ProductEntity, (product) => product.culinaryCultures)
  @JoinTable()
  products: ProductEntity[];

  @Field((type) => [RestaurantEntity])
  @ManyToMany(
    () => RestaurantEntity,
    (restaurant) => restaurant.culinaryCultures,
  )
  restaurants: RestaurantEntity[];

  @Field((type) => [RecipeEntity])
  @OneToMany(() => RecipeEntity, (recipe) => recipe.culinaryCulture)
  @JoinTable()
  recipes: RecipeEntity[];
}
