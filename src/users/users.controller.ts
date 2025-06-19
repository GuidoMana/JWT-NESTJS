import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { Request } from 'express';
import { AuthGuard } from '../middlewares/auth.middleware';
import { RequestWithUser } from 'src/interfaces/request-user';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator';
import { AssignRoleToUserDTO } from './dto/assign-role.dto'; 

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: RequestWithUser) {
    return {
      email: req.user.email,
      role: req.user.role?.name, 
      permissions: req.user.permissionCodes,
    };
  }

  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.service.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.service.register(body);
  }

  @UseGuards(AuthGuard)
  @Post() 
  @Permissions(['roles_create']) 
  createAdminUser(@Body() body: RegisterDTO) {
    return this.service.register(body); 
  }

  @UseGuards(AuthGuard)
  @Get('can-do/:permission')
  canDo(
    @Req() request: RequestWithUser,
    @Param('permission') permission: string,
  ) {
    return this.service.canDo(request.user, permission);
  }

  @Get('refresh-token')
  refreshToken(@Req() request: Request) {
    return this.service.refreshToken(
      request.headers['refresh-token'] as string,
    );
  }

  @UseGuards(AuthGuard)
  @Patch(':userId/assign-role') 
  @Permissions(['roles_update']) 
  assignRole( 
    @Param('userId') userId: string,
    @Body() assignRoleDto: AssignRoleToUserDTO, 
  ) {
    return this.service.assignRoleToUser(+userId, assignRoleDto);
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  @Permissions(['roles_read']) 
  getUserById(@Param('userId') userId: string) {
      return this.service.findUserById(+userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  @Permissions(['roles_read']) 
  findAllUsers() {
      return this.service.findAllUsers(); 
  }

  @UseGuards(AuthGuard)
  @Patch(':userId')
  @Permissions(['roles_update']) 
  updateUser(@Param('userId') userId: string, @Body() body: any) { 
  }

  @UseGuards(AuthGuard)
  @Delete(':userId')
  @Permissions(['roles_delete']) 
  async deleteUser(@Param('userId') userId: string) {
      await this.service.deleteUser(+userId);
      return { message: `User with ID ${userId} deleted successfully.` };
  }
}