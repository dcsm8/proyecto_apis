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
import { CategoryService } from './category.service';
import { plainToInstance } from 'class-transformer';
import { CategoryEntity } from './category.entity';
import { CategoryDto } from './category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/Roles.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';

@Controller('categories')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string) {
    return await this.categoryService.findOne(categoryId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    const category: CategoryEntity = plainToInstance(
      CategoryEntity,
      categoryDto,
    );
    return await this.categoryService.create(category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.ADMIN)
  @Put(':categoryId')
  async update(
    @Param('categoryId') categoryId: string,
    @Body() categoryDto: CategoryDto,
  ) {
    const category: CategoryEntity = plainToInstance(
      CategoryEntity,
      categoryDto,
    );
    return await this.categoryService.update(categoryId, category);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DELETOR, Role.ADMIN)
  @Delete(':categoryId')
  @HttpCode(204)
  async delete(@Param('categoryId') categoryId: string) {
    return await this.categoryService.delete(categoryId);
  }
}
