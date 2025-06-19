import { PermissionEntity } from 'src/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
export declare class PermissionsService {
    private permissionRepository;
    constructor(permissionRepository: Repository<PermissionEntity>);
    createPermission(createPermissionDto: CreatePermissionDTO): Promise<PermissionEntity>;
    findAllPermissions(): Promise<PermissionEntity[]>;
    findPermissionById(id: number): Promise<PermissionEntity>;
    findPermissionByCode(code: string): Promise<PermissionEntity>;
    updatePermission(id: number, updatePermissionDto: UpdatePermissionDTO): Promise<PermissionEntity>;
    deletePermission(id: number): Promise<void>;
}
