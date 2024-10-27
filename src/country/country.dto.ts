import {IsNotEmpty, IsString} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CountryDto {

@Field()
 @IsString()
 @IsNotEmpty()
 readonly name: string; 
}