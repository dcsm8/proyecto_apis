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
import { ProductService } from './product.service';
import { ProductDto } from './product.dto';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from './product.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get()
  async findAll() {
    return await this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Post()
  async create(@Body() productDto: ProductDto) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.create(product);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Put(':productId')
  async update(
    @Param('productId') productId: string,
    @Body() productDto: ProductDto,
  ) {
    const product: ProductEntity = plainToInstance(ProductEntity, productDto);
    return await this.productService.update(productId, product);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELETOR, Role.ADMIN)
  @Delete(':productId')
  @HttpCode(204)
  async delete(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}
