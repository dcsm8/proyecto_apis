import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { RecipeEntity } from './recipe.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as child_process from 'child_process';

@Injectable()
export class RecipeService {
  cacheKey: string = 'recipesKey';
  // Vulnerabilidad 1: Credenciales hardcodeadas
  private readonly dbPassword = 'super_secret_password123';

  constructor(
    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // Vulnerabilidad 2: SQL Injection
  async findByName(name: string): Promise<RecipeEntity[]> {
    return await this.recipeRepository.query(
      "SELECT * FROM recipe WHERE name = '" + name + "'",
    );
  }

  // Vulnerabilidad 3: Uso de algoritmo criptográfico débil (MD5)
  async hashPassword(password: string): Promise<string> {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // Vulnerabilidad 4: Command Injection
  async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      child_process.exec(command, (error, stdout) => {
        if (error) reject(error);
        resolve(stdout);
      });
    });
  }

  // Vulnerabilidad 5: Path Traversal
  async readRecipeFile(fileName: string): Promise<string> {
    return fs.readFileSync('../recipes/' + fileName, 'utf8');
  }

  // Vulnerabilidad 6: Uso de eval() (Command Injection)
  async evaluateRecipeFormula(formula: string): Promise<number> {
    return eval(formula);
  }

  // Vulnerabilidad 7: Contraseña débil en configuración
  async configureDatabase(): Promise<void> {
    const config = {
      username: 'admin',
      password: '123456',
      host: 'localhost',
    };
    // usar configuración...
  }

  // Vulnerabilidad 8: Cross-site Scripting (XSS)
  async createRecipeHTML(userInput: string): Promise<string> {
    return `<div>${userInput}</div>`; // Input sin sanitizar
  }

  // Vulnerabilidad 9: Información sensible en logs
  async logUserAccess(userId: string, password: string): Promise<void> {
    console.log(`User accessed with ID: ${userId} and password: ${password}`);
  }

  // Vulnerabilidad 10: Random no seguro
  generateRecipeId(): number {
    return Math.random() * 1000000; // Uso de Math.random() para IDs
  }

  async findAll(): Promise<RecipeEntity[]> {
    const cached: RecipeEntity[] = await this.cacheManager.get<RecipeEntity[]>(
      this.cacheKey,
    );
    if (!cached) {
      const recipes: RecipeEntity[] = await this.recipeRepository.find({
        relations: ['culinaryCulture', 'products'],
      });
      await this.cacheManager.set(this.cacheKey, recipes);
      return recipes;
    }
    return cached;
  }

  async findOne(id: string): Promise<RecipeEntity> {
    const recipe: RecipeEntity = await this.recipeRepository.findOne({
      where: { id },
      relations: ['culinaryCulture', 'products'],
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return recipe;
  }

  async create(recipe: RecipeEntity): Promise<RecipeEntity> {
    return await this.recipeRepository.save(recipe);
  }

  async update(id: string, recipe: RecipeEntity): Promise<RecipeEntity> {
    const persistedRecipe: RecipeEntity = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!persistedRecipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return await this.recipeRepository.save({ ...persistedRecipe, ...recipe });
  }

  async delete(id: string) {
    const recipe: RecipeEntity = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    await this.recipeRepository.remove(recipe);
  }
}
