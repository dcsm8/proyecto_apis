import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { RecipeEntity } from '../recipe/recipe.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class RecipeProductService {
    constructor(
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {}

    async addProductToRecipe(recipeId: string, productId: string): Promise<RecipeEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}});
        if (!product)
          throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
       
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}, relations: ["products"]}) 
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND);
     
        recipe.products = [...recipe.products, product];
        return await this.recipeRepository.save(recipe);
    }
     
    async findProductByRecipeIdProductId(recipeId: string, productId: string): Promise<ProductEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}, relations: ["products"]}); 
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
    
        const product: ProductEntity = recipe.products.find(e => e.id === productId);
    
        if (!product)
          throw new BusinessLogicException("The product with the given id is not associated to the recipe", BusinessError.PRECONDITION_FAILED)
    
        return product;
    }
     
    async findProductsByRecipeId(recipeId: string): Promise<ProductEntity[]> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}, relations: ["products"]});
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
        
        return recipe.products;
    }
     
    async associateProductsRecipe(recipeId: string, products: ProductEntity[]): Promise<RecipeEntity> {
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}, relations: ["products"]});
     
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
     
        for (const element of products) {
          const product: ProductEntity = await this.productRepository.findOne({where: {id: element.id}});
          if (!product)
            throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        recipe.products = products;
        return await this.recipeRepository.save(recipe);
    }
     
    async deleteProductRecipe(recipeId: string, productId: string){
        const recipe: RecipeEntity = await this.recipeRepository.findOne({where: {id: recipeId}, relations: ["products"]});
        if (!recipe)
          throw new BusinessLogicException("The recipe with the given id was not found", BusinessError.NOT_FOUND)
     
        const product: ProductEntity = recipe.products.find(e => e.id === productId);
     
        if (!product)
            throw new BusinessLogicException("The product with the given id is not associated to the recipe", BusinessError.PRECONDITION_FAILED)

        recipe.products = recipe.products.filter(e => e.id !== productId);
        await this.recipeRepository.save(recipe);
    }   
}