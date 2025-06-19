import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dto/create-role.dto';
import { UpdateRoleDTO } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDTO): Promise<import("../entities/role.entity").RoleEntity>;
    findAll(): Promise<import("../entities/role.entity").RoleEntity[]>;
    findOne(id: string): Promise<import("../entities/role.entity").RoleEntity>;
    update(id: string, updateRoleDto: UpdateRoleDTO): Promise<import("../entities/role.entity").RoleEntity>;
    remove(id: string): Promise<void>;
}
