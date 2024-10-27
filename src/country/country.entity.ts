import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class CountryEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(type => [CulinaryCultureEntity])
  @ManyToMany(
    () => CulinaryCultureEntity,
    (culinaryCulture) => culinaryCulture.countries,
  )
  culinaryCultures: CulinaryCultureEntity[];
}
