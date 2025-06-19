import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { PermissionEntity } from 'src/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleDTO): Promise<RoleEntity> {
    const existingRole = await this.roleRepository.findOneBy({ name: createRoleDto.name });
    if (existingRole) {
      throw new BadRequestException(`Role with name "${createRoleDto.name}" already exists.`);
    }

    const newRole = this.roleRepository.create(createRoleDto);

    if (createRoleDto.permissionCodes && createRoleDto.permissionCodes.length > 0) {
      const permissions = await this.permissionRepository.find({
        where: createRoleDto.permissionCodes.map(code => ({ code })),
      });
      if (permissions.length !== createRoleDto.permissionCodes.length) {
        const foundCodes = permissions.map(p => p.code);
        const notFoundCodes = createRoleDto.permissionCodes.filter(code => !foundCodes.includes(code));
        throw new BadRequestException(`Permissions not found: ${notFoundCodes.join(', ')}`);
      }
      newRole.permissions = permissions;
    }

    return await this.roleRepository.save(newRole);
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return await this.roleRepository.find({ relations: ['permissions'] });
  }

  async findRoleById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }
    return role;
  }

  async findRoleByName(name: string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({ where: { name }, relations: ['permissions'] });
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDTO): Promise<RoleEntity> {
    const role = await this.findRoleById(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOneBy({ name: updateRoleDto.name });
      if (existingRole && existingRole.id !== id) {
        throw new BadRequestException(`Role with name "${updateRoleDto.name}" already exists.`);
      }
    }

    Object.assign(role, updateRoleDto);

    if (updateRoleDto.permissionCodes !== undefined) {
      if (updateRoleDto.permissionCodes && updateRoleDto.permissionCodes.length > 0) {
        const permissions = await this.permissionRepository.find({
          where: updateRoleDto.permissionCodes.map(code => ({ code })),
        });
        if (permissions.length !== updateRoleDto.permissionCodes.length) {
          const foundCodes = permissions.map(p => p.code);
          const notFoundCodes = updateRoleDto.permissionCodes.filter(code => !foundCodes.includes(code));
          throw new BadRequestException(`Permissions not found: ${notFoundCodes.join(', ')}`);
        }
        role.permissions = permissions;
      } else {
        role.permissions = [];
      }
    }

    return await this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }
  }
}