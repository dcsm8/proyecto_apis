import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RecipeDto {

@Field()
 @IsString()
 @IsNotEmpty()
 readonly name: string;
 
 @Field()
 @IsString()
 @IsNotEmpty()
 readonly description: string;
 
 @Field()
 @IsUrl()
 @IsNotEmpty()
 readonly photo: string;
 
 @Field()
 @IsString()
 @IsNotEmpty()
 readonly preparation: string;

 @Field()
 @IsUrl()
 @IsNotEmpty()
 readonly video: string;
 
}