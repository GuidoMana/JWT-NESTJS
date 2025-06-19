import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RequestWithUser } from 'src/interfaces/request-user';
import { JwtService } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';
import { Permissions } from './decorators/permissions.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector:Reflector // Permite leer metadata de los decoradores
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestWithUser = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.replace('Bearer ','');

      if (!token) {
        throw new UnauthorizedException('Authentication token not provided.');
      }

      const payload = this.jwtService.getPayload(token);
      // Cargar el usuario con su rol y los permisos de ese rol para verificar
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      request.user = user; // Asignar el usuario a la solicitud para que los controladores puedan acceder a él

      // Lógica para verificar permisos del decorador
      const requiredPermissions = this.reflector.get(Permissions, context.getHandler());

      if (requiredPermissions && requiredPermissions.length > 0) {
        const userPermissions = user.permissionCodes;
        // Verifica si el usuario tiene AL MENOS UNO de los permisos requeridos
        const hasRequiredPermission = requiredPermissions.some(rp => userPermissions.includes(rp));

        if (!hasRequiredPermission) {
          throw new ForbiddenException('Insufficient permissions for this action.');
        }
      }

      console.log(`User ${user.email} is trying to access. Required permissions:`, requiredPermissions || 'None');
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error;
      }
      // Capturar y relanzar cualquier otro error como Unauthorized
      throw new UnauthorizedException('Authentication failed: ' + error.message);
    }
  }
}