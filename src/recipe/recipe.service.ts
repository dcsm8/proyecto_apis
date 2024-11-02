import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { RecipeEntity } from './recipe.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class RecipeService {

    cacheKey: string = "recipesKey";

    constructor(
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>,

        @Inject(CACHE_MANAGER)
       private readonly cacheManager: Cache
    ) {}

    async findAll(): Promise<RecipeEntity[]> {

        const cached: RecipeEntity[] = await this.cacheManager.get<RecipeEntity[]>(this.cacheKey);

        if(!cached){
            const recipes: RecipeEntity[] = await this.recipeRepository.find({ relations: ["culinaryCulture", "products"] });
            await this.cacheManager.set(this.cacheKey, recipes);
            return recipes;
        }

        return cached;
    }

    async findOne(id: string): Promise<RecipeEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({
            where: { id },
            relations: ["culinaryCulture", "products"]
        });
        if (!recipe)
            throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND);
        
        return recipe;
    }

    async create(recipe: RecipeEntity): Promise<RecipeEntity> {
        return await this.recipeRepository.save(recipe);
    }

    async update(id: string, recipe: RecipeEntity): Promise<RecipeEntity> {
        const persistedRecipe: RecipeEntity = await this.recipeRepository.findOne({ where: { id } });
        if (!persistedRecipe)
            throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.recipeRepository.save({...persistedRecipe, ...recipe});
    }

    async delete(id: string) {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({ where: { id } });
        if (!recipe)
            throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND);
        
        await this.recipeRepository.remove(recipe);
    }
}