import { BaseEntity } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { UserEntity } from './user.entity';
export declare class RoleEntity extends BaseEntity {
    id: number;
    name: string;
    description: string;
    permissions: PermissionEntity[];
    users: UserEntity[];
}
