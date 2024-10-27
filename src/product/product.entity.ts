import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  history: string;

  @Field(() => CategoryEntity) 
  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

  @Field(() => [CulinaryCultureEntity])
  @ManyToMany(
    () => CulinaryCultureEntity,
    (culinaryCulture) => culinaryCulture.products,
  )
  culinaryCultures: CulinaryCultureEntity[];

  @ManyToMany(() => RecipeEntity, (recipe) => recipe.products)
  recipes: RecipeEntity[];
}
