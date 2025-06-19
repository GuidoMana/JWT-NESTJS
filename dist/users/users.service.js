"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../entities/user.entity");
const bcrypt_1 = require("bcrypt");
const jwt_service_1 = require("../jwt/jwt.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../entities/role.entity");
let UsersService = class UsersService {
    constructor(userRepository, roleRepository, jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }
    async refreshToken(refreshToken) {
        return this.jwtService.refreshToken(refreshToken);
    }
    async canDo(user, permissionCode) {
        const fullUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['role', 'role.permissions'],
        });
        if (!fullUser) {
            throw new common_1.UnauthorizedException('User not found.');
        }
        const result = fullUser.permissionCodes.includes(permissionCode);
        if (!result) {
            throw new common_1.ForbiddenException('Insufficient permissions.');
        }
        return true;
    }
    async register(body) {
        try {
            const existingUser = await this.userRepository.findOneBy({ email: body.email });
            if (existingUser) {
                throw new common_1.BadRequestException('User with this email already exists.');
            }
            const user = new user_entity_1.UserEntity();
            Object.assign(user, body);
            user.password = (0, bcrypt_1.hashSync)(user.password, 10);
            const defaultRole = await this.roleRepository.findOneBy({ name: 'user' });
            if (defaultRole) {
                user.role = defaultRole;
            }
            else {
                console.warn("Default 'user' role not found. User registered without a role.");
            }
            await this.userRepository.save(user);
            return { status: 'created' };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException('Error de creación de usuario', 500);
        }
    }
    async login(body) {
        const user = await this.userRepository.findOne({
            where: { email: body.email },
            relations: ['role', 'role.permissions'],
        });
        if (user == null) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        const compareResult = (0, bcrypt_1.compareSync)(body.password, user.password);
        if (!compareResult) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        return {
            accessToken: this.jwtService.generateToken({ email: user.email }, 'auth'),
            refreshToken: this.jwtService.generateToken({ email: user.email }, 'refresh'),
        };
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email },
            relations: ['role', 'role.permissions'],
        });
    }
    async findUserById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['role', 'role.permissions'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
        return user;
    }
    async findAllUsers() {
        return await this.userRepository.find({ relations: ['role', 'role.permissions'] });
    }
    async deleteUser(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with ID ${id} not found.`);
        }
    }
    async assignRoleToUser(userId, assignRoleDto) {
        const user = await this.findUserById(userId);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found.`);
        }
        const roleToAssign = await this.roleRepository.findOne({
            where: { name: assignRoleDto.roleName },
        });
        if (!roleToAssign) {
            throw new common_1.BadRequestException(`Role with name "${assignRoleDto.roleName}" not found.`);
        }
        user.role = roleToAssign;
        return await this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_service_1.JwtService])
], UsersService);
//# sourceMappingURL=users.service.js.map