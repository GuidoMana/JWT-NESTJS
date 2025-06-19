import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { JwtService } from 'src/jwt/jwt.service';
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RoleEntity } from 'src/entities/role.entity';
import { PermissionEntity } from 'src/entities/permission.entity'; 

@Global() 
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity]), 
  ],
  providers: [AuthGuard, JwtService, UsersService],
  exports: [AuthGuard, JwtService, UsersService], 
})
export class AuthModule {}