import { UserI } from '../interfaces/user.interface';
import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('users')
export class UserEntity extends BaseEntity implements UserI {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({unique:true})
  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleEntity, role => role.users)
  @JoinColumn({ name: 'role_id' }) 
  role: RoleEntity;

  // Este getter recopila los códigos de permiso del ÚNICO rol del usuario
  get permissionCodes(): string[] {
    if (!this.role || !this.role.permissions || this.role.permissions.length === 0) {
      return [];
    }
    const uniquePermissions = new Set<string>();
    this.role.permissions.forEach(permission => {
      uniquePermissions.add(permission.code);
    });
    return Array.from(uniquePermissions);
  }
}