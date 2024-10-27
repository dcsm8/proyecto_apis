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
import { ProductDto } from '../product/product.dto';
import { ProductEntity } from '../product/product.entity';
import { CulinaryCultureProductService } from './culinary-culture-product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/Roles.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';

@Controller('culinary-cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulinaryCultureProductController {
  constructor(
    private readonly culinaryCultureProductService: CulinaryCultureProductService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Post(':culinaryCultureId/products/:productId')
  async addProductCulinaryCulture(
    @Param('culinaryCultureId') culinaryCultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.culinaryCultureProductService.addProductCulinaryCulture(
      culinaryCultureId,
      productId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':culinaryCultureId/products/:productId')
  async findProductByCulinaryCultureIdProductId(
    @Param('culinaryCultureId') culinaryCultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.culinaryCultureProductService.findProductByCulinaryCultureIdProductId(
      culinaryCultureId,
      productId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':culinaryCultureId/products')
  async findProductsByCulinaryCultureId(
    @Param('culinaryCultureId') culinaryCultureId: string,
  ) {
    return await this.culinaryCultureProductService.findProductsByCulinaryCultureId(
      culinaryCultureId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Put(':culinaryCultureId/products')
  async associateProductsCulinaryCulture(
    @Body() productsDto: ProductDto[],
    @Param('culinaryCultureId') culinaryCultureId: string,
  ) {
    const products = plainToInstance(ProductEntity, productsDto);
    return await this.culinaryCultureProductService.associateProductsCulinaryCulture(
      culinaryCultureId,
      products,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELETOR, Role.ADMIN)
  @Delete(':culinaryCultureId/products/:productId')
  @HttpCode(204)
  async deleteProductCulinaryCulture(
    @Param('culinaryCultureId') culinaryCultureId: string,
    @Param('productId') productId: string,
  ) {
    return await this.culinaryCultureProductService.deleteProductCulinaryCulture(
      culinaryCultureId,
      productId,
    );
  }
}
