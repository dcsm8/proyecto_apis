import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulinaryCultureDto } from './culinary-culture.dto';
import { CulinaryCultureEntity } from './culinary-culture.entity';
import { CulinaryCultureService } from './culinary-culture.service';

@Resolver(() => CulinaryCultureEntity)
export class CulinaryCultureResolver {
    constructor(private culinaryCultureService: CulinaryCultureService) {}

    @Query(() => [CulinaryCultureEntity])
    culinaryCultures(): Promise<CulinaryCultureEntity[]> {
        return this.culinaryCultureService.findAll();
    }

    @Query(() => CulinaryCultureEntity)
    culinaryCulture(@Args('id') id: string): Promise<CulinaryCultureEntity> {
        return this.culinaryCultureService.findOne(id);
    }

    @Mutation(() => CulinaryCultureEntity)
    createCulinaryCulture(@Args('culinaryCulture') culinaryCultureDto: CulinaryCultureDto): Promise<CulinaryCultureEntity> {
        const culinaryCulture = plainToInstance(CulinaryCultureEntity, culinaryCultureDto);
        return this.culinaryCultureService.create(culinaryCulture);
    }

    @Mutation(() => CulinaryCultureEntity)
    updateCulinaryCulture(
        @Args('id') id: string,
        @Args('culinaryCulture') culinaryCultureDto: CulinaryCultureDto
    ): Promise<CulinaryCultureEntity> {
        const culinaryCulture = plainToInstance(CulinaryCultureEntity, culinaryCultureDto);
        return this.culinaryCultureService.update(id, culinaryCulture);
    }

    @Mutation(() => String)
    deleteCulinaryCulture(@Args('id') id: string) {
        this.culinaryCultureService.delete(id);
        return id;
    }
}