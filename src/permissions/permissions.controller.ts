import { Body, Controller, Post, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions(['roles_create'])
  create(@Body() createPermissionDto: CreatePermissionDTO) {
    return this.permissionsService.createPermission(createPermissionDto);
  }

  @Get()
  @Permissions(['roles_read']) 
  findAll() {
    return this.permissionsService.findAllPermissions();
  }

  @Get(':id')
  @Permissions(['roles_read']) 
  findOne(@Param('id') id: string) {
    return this.permissionsService.findPermissionById(+id);
  }

  @Patch(':id')
  @Permissions(['roles_update']) 
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDTO) {
    return this.permissionsService.updatePermission(+id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions(['roles_delete']) 
  remove(@Param('id') id: string) {
    return this.permissionsService.deletePermission(+id);
  }
}