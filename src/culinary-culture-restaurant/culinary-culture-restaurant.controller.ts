import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CulinaryCultureRestaurantService } from './culinary-culture-restaurant.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { AssociateRestaurantsDto } from './culinary-culture-restaurant.dto';
import { UUID } from 'src/shared/validators/uuid.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('culinary-cultures')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CulinaryCultureRestaurantController {
  constructor(
    private readonly culinaryCultureRestaurantService: CulinaryCultureRestaurantService,
  ) {}

  @Post(':culinaryCultureId/restaurants/:restaurantId')
  @Roles(Role.MANAGER, Role.ADMIN)
  async addRestaurantToCulinaryCulture(
    @UUID('culinaryCultureId') culinaryCultureId: string,
    @UUID('restaurantId') restaurantId: string,
  ) {
    return await this.culinaryCultureRestaurantService.addRestaurantToCulinaryCulture(
      culinaryCultureId,
      restaurantId,
    );
  }

  @Get(':culinaryCultureId/restaurants')
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findRestaurantsByCulinaryCultureId(
    @UUID('culinaryCultureId') culinaryCultureId: string,
  ) {
    return await this.culinaryCultureRestaurantService.findRestaurantsByCulinaryCultureId(
      culinaryCultureId,
    );
  }

  @Get(':culinaryCultureId/restaurants/:restaurantId')
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findRestaurantByCulinaryCultureIdRestaurantId(
    @UUID('culinaryCultureId') culinaryCultureId: string,
    @UUID('restaurantId') restaurantId: string,
  ) {
    return await this.culinaryCultureRestaurantService.findRestaurantByCulinaryCultureIdRestaurantId(
      culinaryCultureId,
      restaurantId,
    );
  }

  @Put(':culinaryCultureId/restaurants')
  @Roles(Role.MANAGER, Role.ADMIN)
  async associateRestaurantsCulinaryCulture(
    @UUID('culinaryCultureId') culinaryCultureId: string,
    @Body() associateRestaurantsDto: AssociateRestaurantsDto,
  ) {
    const restaurants = associateRestaurantsDto.restaurants.map(
      (id) => ({ id }) as RestaurantEntity,
    );
    return await this.culinaryCultureRestaurantService.associateRestaurantsCulinaryCulture(
      culinaryCultureId,
      restaurants,
    );
  }

  @Delete(':culinaryCultureId/restaurants/:restaurantId')
  @Roles(Role.DELETOR, Role.ADMIN)
  @HttpCode(204)
  async deleteRestaurantFromCulinaryCulture(
    @UUID('culinaryCultureId') culinaryCultureId: string,
    @UUID('restaurantId') restaurantId: string,
  ) {
    await this.culinaryCultureRestaurantService.deleteRestaurantFromCulinaryCulture(
      culinaryCultureId,
      restaurantId,
    );
  }

  @Get('restaurants/:restaurantId/culinary-cultures')
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findCulinaryCulturesByRestaurantId(
    @UUID('restaurantId') restaurantId: string,
  ) {
    return await this.culinaryCultureRestaurantService.findCulinaryCulturesByRestaurantId(
      restaurantId,
    );
  }
}
