import { Module } from '@nestjs/common';
import { CulinaryCultureRecipeService } from './culinary-culture-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { CulinaryCultureRecipeController } from './culinary-culture-recipe.controller';
import { CulinaryCultureRecipeResolver } from './culinary-culture-recipe.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulinaryCultureEntity, RecipeEntity])],
  providers: [CulinaryCultureRecipeService, CulinaryCultureRecipeResolver],
  controllers: [CulinaryCultureRecipeController],
})
export class CulinaryCultureRecipeModule {}
