import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { CategoryProductService } from './category-product.service';
import { ProductDto } from '../product/product.dto';
import { ProductEntity } from '../product/product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/Roles.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';

@Controller('categories')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoryProductController {
  constructor(
    private readonly categoryProductService: CategoryProductService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Post(':categoryId/products/:productId')
  async addProductCategory(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    return await this.categoryProductService.addProductCategory(
      categoryId,
      productId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':categoryId/products/:productId')
  async findProductByCategoryIdProductId(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    return await this.categoryProductService.findProductByCategoryIdProductId(
      categoryId,
      productId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':categoryId/products')
  async findProductsByCategoryId(@Param('categoryId') categoryId: string) {
    return await this.categoryProductService.findProductsByCategoryId(
      categoryId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Put(':categoryId/products')
  async associateProductsCategory(
    @Body() productsDto: ProductDto[],
    @Param('categoryId') categoryId: string,
  ) {
    const products = plainToInstance(ProductEntity, productsDto);
    return await this.categoryProductService.associateProductsCategory(
      categoryId,
      products,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELETOR, Role.ADMIN)
  @Delete(':categoryId/products/:productId')
  @HttpCode(204)
  async deleteProductCategory(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    return await this.categoryProductService.deleteProductCategory(
      categoryId,
      productId,
    );
  }
}
