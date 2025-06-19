import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDTO): Promise<PermissionEntity> {
    const existingPermission = await this.permissionRepository.findOneBy({ code: createPermissionDto.code });
    if (existingPermission) {
      throw new BadRequestException(`Permission with code "${createPermissionDto.code}" already exists.`);
    }
    const newPermission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(newPermission);
  }

  async findAllPermissions(): Promise<PermissionEntity[]> {
    return await this.permissionRepository.find();
  }

  async findPermissionById(id: number): Promise<PermissionEntity> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found.`);
    }
    return permission;
  }

  async findPermissionByCode(code: string): Promise<PermissionEntity> {
    return await this.permissionRepository.findOneBy({ code });
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDTO): Promise<PermissionEntity> {
    const permission = await this.findPermissionById(id);

    if (updatePermissionDto.code && updatePermissionDto.code !== permission.code) {
      const existingPermission = await this.permissionRepository.findOneBy({ code: updatePermissionDto.code });
      if (existingPermission && existingPermission.id !== id) {
        throw new BadRequestException(`Permission with code "${updatePermissionDto.code}" already exists.`);
      }
    }
    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async deletePermission(id: number): Promise<void> {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permission with ID ${id} not found.`);
    }
  }
}