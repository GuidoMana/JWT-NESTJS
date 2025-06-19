import { UsersService } from './users.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { Request } from 'express';
import { RequestWithUser } from 'src/interfaces/request-user';
import { AssignRoleToUserDTO } from './dto/assign-role.dto';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    me(req: RequestWithUser): {
        email: string;
        role: string;
        permissions: string[];
    };
    login(body: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(body: RegisterDTO): Promise<{
        status: string;
    }>;
    createAdminUser(body: RegisterDTO): Promise<{
        status: string;
    }>;
    canDo(request: RequestWithUser, permission: string): Promise<boolean>;
    refreshToken(request: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    assignRole(userId: string, assignRoleDto: AssignRoleToUserDTO): Promise<import("../entities/user.entity").UserEntity>;
    getUserById(userId: string): Promise<import("../entities/user.entity").UserEntity>;
    findAllUsers(): Promise<import("../entities/user.entity").UserEntity[]>;
    updateUser(userId: string, body: any): void;
    deleteUser(userId: string): Promise<{
        message: string;
    }>;
}
