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
import { RestaurantCulinaryCultureService } from './restaurant-culinary-culture.service';
import { CulinaryCultureEntity } from '../culinary-culture/culinary-culture.entity';
import { AssociateCulinaryCulturesDto } from './restaurant-culinary-culture.dto';
import { UUID } from 'src/shared/validators/uuid.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../shared/security/role.enum';
import { RolesGuard } from '../auth/guards/Roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantCulinaryCultureController {
  constructor(
    private readonly restaurantCulinaryCultureService: RestaurantCulinaryCultureService,
  ) {}

  @Post(':restaurantId/culinary-cultures/:culinaryCultureId')
  @Roles(Role.MANAGER, Role.ADMIN)
  async addCulinaryCultureToRestaurant(
    @UUID('restaurantId') restaurantId: string,
    @UUID('culinaryCultureId') culinaryCultureId: string,
  ) {
    return await this.restaurantCulinaryCultureService.addCulinaryCultureToRestaurant(
      restaurantId,
      culinaryCultureId,
    );
  }

  @Get(':restaurantId/culinary-cultures')
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findCulinaryCulturesByRestaurantId(
    @UUID('restaurantId') restaurantId: string,
  ) {
    return await this.restaurantCulinaryCultureService.findCulinaryCulturesByRestaurantId(
      restaurantId,
    );
  }

  @Get(':restaurantId/culinary-cultures/:culinaryCultureId')
  @Roles(Role.USER, Role.ADMIN, Role.RESTAURANT_USER)
  async findCulinaryCultureByRestaurantIdCulinaryCultureId(
    @UUID('restaurantId') restaurantId: string,
    @UUID('culinaryCultureId') culinaryCultureId: string,
  ) {
    return await this.restaurantCulinaryCultureService.findCulinaryCultureByRestaurantIdCulinaryCultureId(
      restaurantId,
      culinaryCultureId,
    );
  }

  @Put(':restaurantId/culinary-cultures')
  @Roles(Role.MANAGER, Role.ADMIN)
  async associateCulinaryCulturesRestaurant(
    @UUID('restaurantId') restaurantId: string,
    @Body() associateCulinaryCulturesDto: AssociateCulinaryCulturesDto,
  ) {
    const culinaryCultures = associateCulinaryCulturesDto.culinaryCultures.map(
      (id) => ({ id }) as CulinaryCultureEntity,
    );
    return await this.restaurantCulinaryCultureService.associateCulinaryCulturesRestaurant(
      restaurantId,
      culinaryCultures,
    );
  }

  @Delete(':restaurantId/culinary-cultures/:culinaryCultureId')
  @Roles(Role.DELETOR, Role.ADMIN)
  @HttpCode(204)
  async deleteCulinaryCultureFromRestaurant(
    @UUID('restaurantId') restaurantId: string,
    @UUID('culinaryCultureId') culinaryCultureId: string,
  ) {
    await this.restaurantCulinaryCultureService.deleteCulinaryCultureFromRestaurant(
      restaurantId,
      culinaryCultureId,
    );
  }
}
