import {
  HttpException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException
} from '@nestjs/common';
import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { UserI } from 'src/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from 'src/entities/role.entity';
import { AssignRoleToUserDTO } from './dto/assign-role.dto'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService,
  ) {}

  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken);
  }

  async canDo(user: UserI, permissionCode: string): Promise<boolean> {
    const fullUser = await this.userRepository.findOne({
        where: { id: user.id },
        relations: ['role', 'role.permissions'],
    });

    if (!fullUser) {
        throw new UnauthorizedException('User not found.');
    }

    const result = fullUser.permissionCodes.includes(permissionCode);
    if (!result) {
      throw new ForbiddenException('Insufficient permissions.');
    }
    return true;
  }

  async register(body: RegisterDTO) {
    try {
      const existingUser = await this.userRepository.findOneBy({ email: body.email });
      if (existingUser) {
        throw new BadRequestException('User with this email already exists.');
      }

      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);

      const defaultRole = await this.roleRepository.findOneBy({ name: 'user' });
      if (defaultRole) {
          user.role = defaultRole;
      } else {
          console.warn("Default 'user' role not found. User registered without a role.");
      }

      await this.userRepository.save(user);
      return { status: 'created' };
    } catch (error) {
        if (error instanceof BadRequestException) {
            throw error;
        }
        throw new HttpException('Error de creación de usuario', 500);
    }
  }

  async login(body: LoginDTO) {
    const user = await this.userRepository.findOne({
        where: { email: body.email },
        relations: ['role', 'role.permissions'],
    });
    if (user == null) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const compareResult = compareSync(body.password, user.password);
    if (!compareResult) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return {
      accessToken: this.jwtService.generateToken({ email: user.email }, 'auth'),
      refreshToken: this.jwtService.generateToken(
        { email: user.email },
        'refresh',
      ),
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
        where: { email },
        relations: ['role', 'role.permissions'],
    });
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role', 'role.permissions'],
    });
    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async findAllUsers(): Promise<UserEntity[]> {
      return await this.userRepository.find({ relations: ['role', 'role.permissions'] });
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }

  async assignRoleToUser(userId: number, assignRoleDto: AssignRoleToUserDTO): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const roleToAssign = await this.roleRepository.findOne({
        where: { name: assignRoleDto.roleName }, 
    });

    if (!roleToAssign) {
        throw new BadRequestException(`Role with name "${assignRoleDto.roleName}" not found.`);
    }

    user.role = roleToAssign;
    return await this.userRepository.save(user);
  }
}