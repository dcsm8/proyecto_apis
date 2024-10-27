import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';

@ObjectType()
@Entity()
export class RestaurantEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  country: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  michelinStars: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  michelinStarDate: Date;

  @Field(() => [CulinaryCultureEntity])
  @ManyToMany(
    () => CulinaryCultureEntity,
    (culinaryCulture) => culinaryCulture.restaurants,
  )
  @JoinTable()
  culinaryCultures: CulinaryCultureEntity[];
}
