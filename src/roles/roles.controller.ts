import { Body, Controller, Post, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { Permissions } from 'src/middlewares/decorators/permissions.decorator';

@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(['roles_create']) 
  create(@Body() createRoleDto: CreateRoleDTO) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @Permissions(['roles_read']) 
  findAll() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @Permissions(['roles_read']) 
  findOne(@Param('id') id: string) {
    return this.rolesService.findRoleById(+id);
  }

  @Patch(':id')
  @Permissions(['roles_update']) 
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDTO) {
    return this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(['roles_delete']) 
  remove(@Param('id') id: string) {
    return this.rolesService.deleteRole(+id);
  }
}