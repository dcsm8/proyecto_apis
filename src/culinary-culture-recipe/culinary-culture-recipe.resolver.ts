import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CulinaryCultureRecipeService } from './culinary-culture-recipe.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { RecipeDto } from '../recipe/recipe.dto';
import { plainToInstance } from 'class-transformer';

@Resolver(() => CulinaryCultureEntity)
export class CulinaryCultureRecipeResolver {
    constructor(private culinaryCultureRecipeService: CulinaryCultureRecipeService) {}

    @Mutation(() => CulinaryCultureEntity)
    addRecipeToCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('recipe') recipeDto: RecipeDto
    ): Promise<CulinaryCultureEntity> {
        const recipe = plainToInstance(RecipeEntity, recipeDto);
        return this.culinaryCultureRecipeService.addRecipeCulinaryCulture(culinaryCultureId, recipe);
    }

    @Query(() => RecipeEntity)
    findRecipeByCulinaryCultureIdRecipeId(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('recipeId') recipeId: string
    ): Promise<RecipeEntity> {
        return this.culinaryCultureRecipeService.findRecipeByCulinaryCultureIdRecipeId(culinaryCultureId, recipeId);
    }

    @Query(() => [RecipeEntity])
    findRecipesByCulinaryCultureId(
        @Args('culinaryCultureId') culinaryCultureId: string
    ): Promise<RecipeEntity[]> {
        return this.culinaryCultureRecipeService.findRecipesByCulinaryCultureId(culinaryCultureId);
    }

    @Mutation(() => CulinaryCultureEntity)
    associateRecipesToCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('recipes', { type: () => [RecipeDto] }) recipesDto: RecipeDto[]
    ): Promise<CulinaryCultureEntity> {
        const recipes = plainToInstance(RecipeEntity, recipesDto);
        return this.culinaryCultureRecipeService.associateRecipesCulinaryCulture(culinaryCultureId, recipes);
    }

    @Mutation(() => Boolean)
    deleteRecipeFromCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('recipeId') recipeId: string
    ): Promise<boolean> {
        return this.culinaryCultureRecipeService.deleteRecipeCulinaryCulture(culinaryCultureId, recipeId)
            .then(() => true)
            .catch(() => false);
    }
}