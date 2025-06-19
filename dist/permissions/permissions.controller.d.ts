import { PermissionsService } from './permissions.service';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    create(createPermissionDto: CreatePermissionDTO): Promise<import("../entities/permission.entity").PermissionEntity>;
    findAll(): Promise<import("../entities/permission.entity").PermissionEntity[]>;
    findOne(id: string): Promise<import("../entities/permission.entity").PermissionEntity>;
    update(id: string, updatePermissionDto: UpdatePermissionDTO): Promise<import("../entities/permission.entity").PermissionEntity>;
    remove(id: string): Promise<void>;
}
