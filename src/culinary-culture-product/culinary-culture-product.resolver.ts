import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CulinaryCultureProductService } from './culinary-culture-product.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { ProductEntity } from '../product/product.entity';

@Resolver(() => CulinaryCultureEntity)
export class CulinaryCultureProductResolver {
  constructor(
    private culinaryCultureProductService: CulinaryCultureProductService,
  ) {}

  @Mutation(() => CulinaryCultureEntity)
    addProductToCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('productId') productId: string,
    ): Promise<CulinaryCultureEntity> {
        return this.culinaryCultureProductService.addProductCulinaryCulture(culinaryCultureId, productId);
    }

    @Query(() => ProductEntity)
    findProductInCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('productId') productId: string,
    ): Promise<ProductEntity> {
        return this.culinaryCultureProductService.findProductByCulinaryCultureIdProductId(culinaryCultureId, productId);
    }

    @Query(() => [ProductEntity])
    findProductsByCulinaryCulture(@Args('culinaryCultureId') culinaryCultureId: string): Promise<ProductEntity[]> {
        return this.culinaryCultureProductService.findProductsByCulinaryCultureId(culinaryCultureId);
    }

    @Mutation(() => CulinaryCultureEntity)
    associateProductsCulinaryCulture(
        @Args('culinaryCultureId') culinaryCultureId: string,
        @Args('productsIds', { type: () => [String] }) productsIds: string[]
    ): Promise<CulinaryCultureEntity> {
        const products = productsIds.map(id => ({ id } as ProductEntity));
        return this.culinaryCultureProductService.associateProductsCulinaryCulture(culinaryCultureId, products);
    }

    @Mutation(() => String)
    async deleteProductFromCulinaryCulture(
    @Args('culinaryCultureId') culinaryCultureId: string,
    @Args('productId') productId: string,
    ): Promise<string> {
    await this.culinaryCultureProductService.deleteProductCulinaryCulture(culinaryCultureId, productId);
    return `Product with ID ${productId} successfully deleted from CulinaryCulture with ID ${culinaryCultureId}`;
    }
}
