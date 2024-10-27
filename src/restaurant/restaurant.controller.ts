import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurant.dto';
import { UUID } from 'src/shared/validators/uuid.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findOne(@UUID('id') id: string) {
    return await this.restaurantService.findOne(id);
  }

  @Post()
  @Roles(Role.MANAGER, Role.ADMIN)
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantService.create(
      createRestaurantDto as RestaurantEntity,
    );
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  async update(
    @UUID('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return await this.restaurantService.update(
      id,
      updateRestaurantDto as RestaurantEntity,
    );
  }

  @Delete(':id')
  @Roles(Role.DELETOR, Role.ADMIN)
  @HttpCode(204)
  async delete(@UUID('id') id: string) {
    await this.restaurantService.delete(id);
  }
}
