import { BaseEntity } from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionI } from 'src/interfaces/permission.interface';
export declare class PermissionEntity extends BaseEntity implements PermissionI {
    id: number;
    code: string;
    description: string;
    roles: RoleEntity[];
}
