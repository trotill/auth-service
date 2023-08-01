import { SetMetadata } from '@nestjs/common';

export const AvailForRoles = (roles: string[]) => SetMetadata('roles', roles);
