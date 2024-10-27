import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../product/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoryEntity {
   @Field()
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Field()
   @Column()
   name: string;

   @Field(() => [ProductEntity])
   @OneToMany(() => ProductEntity, product => product.category)
   products: ProductEntity[];
}