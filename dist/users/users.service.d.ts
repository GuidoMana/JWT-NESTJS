import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { UserI } from 'src/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { RoleEntity } from 'src/entities/role.entity';
import { AssignRoleToUserDTO } from './dto/assign-role.dto';
export declare class UsersService {
    private userRepository;
    private roleRepository;
    private jwtService;
    constructor(userRepository: Repository<UserEntity>, roleRepository: Repository<RoleEntity>, jwtService: JwtService);
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    canDo(user: UserI, permissionCode: string): Promise<boolean>;
    register(body: RegisterDTO): Promise<{
        status: string;
    }>;
    login(body: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    findByEmail(email: string): Promise<UserEntity>;
    findUserById(id: number): Promise<UserEntity>;
    findAllUsers(): Promise<UserEntity[]>;
    deleteUser(id: number): Promise<void>;
    assignRoleToUser(userId: number, assignRoleDto: AssignRoleToUserDTO): Promise<UserEntity>;
}
