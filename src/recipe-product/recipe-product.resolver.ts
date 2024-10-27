import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { RecipeProductService } from './recipe-product.service';
import { RecipeEntity } from '../recipe/recipe.entity';
import { ProductEntity } from '../product/product.entity';

@Resolver(() => RecipeEntity)
export class RecipeProductResolver {
  constructor(private recipeProductService: RecipeProductService) {}

  @Mutation(() => RecipeEntity)
  addProductToRecipe(
    @Args('recipeId') recipeId: string,
    @Args('productId') productId: string,
  ): Promise<RecipeEntity> {
    return this.recipeProductService.addProductToRecipe(recipeId, productId);
  }

  @Query(() => ProductEntity)
  findProductByRecipeIdProductId(
    @Args('recipeId') recipeId: string,
    @Args('productId') productId: string,
  ): Promise<ProductEntity> {
    return this.recipeProductService.findProductByRecipeIdProductId(recipeId, productId);
  }

  @Query(() => [ProductEntity])
  findProductsByRecipeId(
    @Args('recipeId') recipeId: string,
  ): Promise<ProductEntity[]> {
    return this.recipeProductService.findProductsByRecipeId(recipeId);
  }

  @Mutation(() => RecipeEntity)
  associateProductsRecipe(
    @Args('recipeId') recipeId: string,
    @Args('products', { type: () => [ProductEntity] }) products: ProductEntity[],
  ): Promise<RecipeEntity> {
    return this.recipeProductService.associateProductsRecipe(recipeId, products);
  }

  @Mutation(() => Boolean)
  deleteProductRecipe(
    @Args('recipeId') recipeId: string,
    @Args('productId') productId: string,
  ): Promise<boolean> {
    return this.recipeProductService.deleteProductRecipe(recipeId, productId)
      .then(() => true)
      .catch(() => false);
  }
}