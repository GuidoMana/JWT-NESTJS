import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionI } from 'src/interfaces/permission.interface';

@Entity('permissions')
export class PermissionEntity extends BaseEntity implements PermissionI {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column()
    description: string;

    @ManyToMany(() => RoleEntity, role => role.permissions)
    roles: RoleEntity[];
}