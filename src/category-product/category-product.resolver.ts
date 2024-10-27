import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoryProductService } from './category-product.service';
import { CategoryEntity } from '../category/category.entity';
import { ProductEntity } from '../product/product.entity';

@Resolver(() => CategoryEntity)
export class CategoryProductResolver {
    constructor(private categoryProductService: CategoryProductService) {}

    @Mutation(() => CategoryEntity)
    addProductToCategory(
        @Args('categoryId') categoryId: string,
        @Args('productId') productId: string,
    ): Promise<CategoryEntity> {
        return this.categoryProductService.addProductCategory(categoryId, productId);
    }

    @Query(() => ProductEntity)
    findProductInCategory(
        @Args('categoryId') categoryId: string,
        @Args('productId') productId: string,
    ): Promise<ProductEntity> {
        return this.categoryProductService.findProductByCategoryIdProductId(categoryId, productId);
    }

    @Query(() => [ProductEntity])
    findProductsByCategory(@Args('categoryId') categoryId: string): Promise<ProductEntity[]> {
        return this.categoryProductService.findProductsByCategoryId(categoryId);
    }

    @Mutation(() => CategoryEntity)
    associateProductsCategory(
        @Args('categoryId') categoryId: string,
        @Args('productsIds', { type: () => [String] }) productsIds: string[]
    ): Promise<CategoryEntity> {
        const products = productsIds.map(id => ({ id } as ProductEntity));
        return this.categoryProductService.associateProductsCategory(categoryId, products);
    }

    @Mutation(() => String)
    async deleteProductFromCategory(
    @Args('categoryId') categoryId: string,
    @Args('productId') productId: string,
    ): Promise<string> {
    await this.categoryProductService.deleteProductCategory(categoryId, productId);
    return `Product with ID ${productId} successfully deleted from Category with ID ${categoryId}`;
    }
}
