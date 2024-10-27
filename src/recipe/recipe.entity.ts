import { ProductEntity } from '../product/product.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class RecipeEntity {
  @Field()
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
  photo: string;

  @Field()
  @Column()
  preparation: string;

  @Field()
  @Column()
  video: string;

  @Field(type => [CulinaryCultureEntity])
  @ManyToOne(
    () => CulinaryCultureEntity,
    (culinaryCulture) => culinaryCulture.recipes,
  )
  @JoinTable()
  culinaryCulture: CulinaryCultureEntity;

  //@Field(type => [ProductEntity])
  @ManyToMany(() => ProductEntity, (product) => product.recipes)
  @JoinTable()
  products: ProductEntity[];
}
