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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_entity_1 = require("../entities/role.entity");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../entities/permission.entity");
let RolesService = class RolesService {
    constructor(roleRepository, permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async createRole(createRoleDto) {
        const existingRole = await this.roleRepository.findOneBy({ name: createRoleDto.name });
        if (existingRole) {
            throw new common_1.BadRequestException(`Role with name "${createRoleDto.name}" already exists.`);
        }
        const newRole = this.roleRepository.create(createRoleDto);
        if (createRoleDto.permissionCodes && createRoleDto.permissionCodes.length > 0) {
            const permissions = await this.permissionRepository.find({
                where: createRoleDto.permissionCodes.map(code => ({ code })),
            });
            if (permissions.length !== createRoleDto.permissionCodes.length) {
                const foundCodes = permissions.map(p => p.code);
                const notFoundCodes = createRoleDto.permissionCodes.filter(code => !foundCodes.includes(code));
                throw new common_1.BadRequestException(`Permissions not found: ${notFoundCodes.join(', ')}`);
            }
            newRole.permissions = permissions;
        }
        return await this.roleRepository.save(newRole);
    }
    async findAllRoles() {
        return await this.roleRepository.find({ relations: ['permissions'] });
    }
    async findRoleById(id) {
        const role = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
        if (!role) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found.`);
        }
        return role;
    }
    async findRoleByName(name) {
        return await this.roleRepository.findOne({ where: { name }, relations: ['permissions'] });
    }
    async updateRole(id, updateRoleDto) {
        const role = await this.findRoleById(id);
        if (updateRoleDto.name && updateRoleDto.name !== role.name) {
            const existingRole = await this.roleRepository.findOneBy({ name: updateRoleDto.name });
            if (existingRole && existingRole.id !== id) {
                throw new common_1.BadRequestException(`Role with name "${updateRoleDto.name}" already exists.`);
            }
        }
        Object.assign(role, updateRoleDto);
        if (updateRoleDto.permissionCodes !== undefined) {
            if (updateRoleDto.permissionCodes && updateRoleDto.permissionCodes.length > 0) {
                const permissions = await this.permissionRepository.find({
                    where: updateRoleDto.permissionCodes.map(code => ({ code })),
                });
                if (permissions.length !== updateRoleDto.permissionCodes.length) {
                    const foundCodes = permissions.map(p => p.code);
                    const notFoundCodes = updateRoleDto.permissionCodes.filter(code => !foundCodes.includes(code));
                    throw new common_1.BadRequestException(`Permissions not found: ${notFoundCodes.join(', ')}`);
                }
                role.permissions = permissions;
            }
            else {
                role.permissions = [];
            }
        }
        return await this.roleRepository.save(role);
    }
    async deleteRole(id) {
        const result = await this.roleRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Role with ID ${id} not found.`);
        }
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.RoleEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map