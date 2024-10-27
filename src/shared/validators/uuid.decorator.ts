import { Param, ParseUUIDPipe } from '@nestjs/common';
import { UUIDValidationPipe } from './uuid-validation.pipe';

export function UUID(paramName: string = 'id') {
  return Param(paramName, new ParseUUIDPipe(), UUIDValidationPipe);
}
