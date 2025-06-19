import { RoleEntity } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
import { PermissionEntity } from 'src/entities/permission.entity';
export declare class RolesService {
    private roleRepository;
    private permissionRepository;
    constructor(roleRepository: Repository<RoleEntity>, permissionRepository: Repository<PermissionEntity>);
    createRole(createRoleDto: CreateRoleDTO): Promise<RoleEntity>;
    findAllRoles(): Promise<RoleEntity[]>;
    findRoleById(id: number): Promise<RoleEntity>;
    findRoleByName(name: string): Promise<RoleEntity>;
    updateRole(id: number, updateRoleDto: UpdateRoleDTO): Promise<RoleEntity>;
    deleteRole(id: number): Promise<void>;
}
