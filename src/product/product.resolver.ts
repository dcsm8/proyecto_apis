import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { ProductDto } from './product.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class ProductResolver {
    constructor(private productService: ProductService) {}

    @Query(() => [ProductEntity])
    products(): Promise<ProductEntity[]> {
        return this.productService.findAll();
    }

    @Query(() => ProductEntity)
    product(@Args('id') id: string): Promise<ProductEntity> {
        return this.productService.findOne(id);
    }

    @Mutation(() => ProductEntity)
    createProduct(@Args('product') productDto: ProductDto): Promise<ProductEntity> {
       const product = plainToInstance(ProductEntity, productDto);
       return this.productService.create(product);
    }

    @Mutation(() => ProductEntity)
    updateProduct(@Args('id') id: string, @Args('product') productDto: ProductDto): Promise<ProductEntity> {
        const product = plainToInstance(ProductEntity, productDto);
        return this.productService.update(id, product);
    }

    @Mutation(() => String)
    deleteProduct(@Args('id') id: string) {
        this.productService.delete(id);
        return id;
    }
}
