import { SetMetadata } from '@nestjs/common';
import { Role } from '../shared/security/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
