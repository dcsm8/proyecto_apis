import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CulinaryCultureRecipeService {
    constructor(
        @InjectRepository(CulinaryCultureEntity)
        private readonly culinaryCultureRepository: Repository<CulinaryCultureEntity>,
     
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>
    ) {}

    async addRecipeCulinaryCulture(culinaryCultureId: string, recipeBody: RecipeEntity): Promise<CulinaryCultureEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.save(recipeBody);
        
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["recipes"]}) 
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND);
     
        culinaryCulture.recipes = [...culinaryCulture.recipes, recipe];
        return await this.culinaryCultureRepository.save(culinaryCulture);
    }
     
    async findRecipeByCulinaryCultureIdRecipeId(culinaryCultureId: string, recipeId: string): Promise<RecipeEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}});
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
        
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["recipes"]}); 
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
    
        const culinaryCultureRecipe: RecipeEntity = culinaryCulture.recipes.find(e => e.id === recipe.id);
    
        if (!culinaryCultureRecipe)
          throw new BusinessLogicException("The recipe with the given id is not associated to the culinary culture", BusinessError.PRECONDITION_FAILED)
    
        return culinaryCultureRecipe;
    }
     
    async findRecipesByCulinaryCultureId(culinaryCultureId: string): Promise<RecipeEntity[]> {
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["recipes"]});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
        
        return culinaryCulture.recipes;
    }
     
    async associateRecipesCulinaryCulture(culinaryCultureId: string, recipes: RecipeEntity[]): Promise<CulinaryCultureEntity> {
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["recipes"]});
     
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
     
        for (const element of recipes) {
          const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: element.id}});
          if (!recipe)
            throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        culinaryCulture.recipes = recipes;
        return await this.culinaryCultureRepository.save(culinaryCulture);
    }
     
    async deleteRecipeCulinaryCulture(culinaryCultureId: string, recipeId: string){
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}});
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
     
        const culinaryCulture: CulinaryCultureEntity = await this.culinaryCultureRepository.findOne({where: {id: culinaryCultureId}, relations: ["recipes"]});
        if (!culinaryCulture)
          throw new BusinessLogicException("The culinary culture with the given id was not found", BusinessError.NOT_FOUND)
     
        const culinaryCultureRecipe: RecipeEntity = culinaryCulture.recipes.find(e => e.id === recipe.id);
     
        if (!culinaryCultureRecipe)
            throw new BusinessLogicException("The recipe with the given id is not associated to the culinary culture", BusinessError.PRECONDITION_FAILED)

        culinaryCulture.recipes = culinaryCulture.recipes.filter(e => e.id !== recipeId);
        await this.culinaryCultureRepository.save(culinaryCulture);
    }   
}