import {Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { RecipeResolver } from './recipe.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity]), CacheModule.register()],
  providers: [RecipeService, RecipeResolver],
  controllers: [RecipeController],
})
export class RecipeModule {}
