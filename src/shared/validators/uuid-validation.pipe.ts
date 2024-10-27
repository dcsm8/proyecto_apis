import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!uuidValidate(value)) {
      throw new BadRequestException('Invalid UUID format');
    }
    return value;
  }
}
