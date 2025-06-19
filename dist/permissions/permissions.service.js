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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const permission_entity_1 = require("../entities/permission.entity");
const typeorm_2 = require("typeorm");
let PermissionsService = class PermissionsService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async createPermission(createPermissionDto) {
        const existingPermission = await this.permissionRepository.findOneBy({ code: createPermissionDto.code });
        if (existingPermission) {
            throw new common_1.BadRequestException(`Permission with code "${createPermissionDto.code}" already exists.`);
        }
        const newPermission = this.permissionRepository.create(createPermissionDto);
        return await this.permissionRepository.save(newPermission);
    }
    async findAllPermissions() {
        return await this.permissionRepository.find();
    }
    async findPermissionById(id) {
        const permission = await this.permissionRepository.findOneBy({ id });
        if (!permission) {
            throw new common_1.NotFoundException(`Permission with ID ${id} not found.`);
        }
        return permission;
    }
    async findPermissionByCode(code) {
        return await this.permissionRepository.findOneBy({ code });
    }
    async updatePermission(id, updatePermissionDto) {
        const permission = await this.findPermissionById(id);
        if (updatePermissionDto.code && updatePermissionDto.code !== permission.code) {
            const existingPermission = await this.permissionRepository.findOneBy({ code: updatePermissionDto.code });
            if (existingPermission && existingPermission.id !== id) {
                throw new common_1.BadRequestException(`Permission with code "${updatePermissionDto.code}" already exists.`);
            }
        }
        Object.assign(permission, updatePermissionDto);
        return await this.permissionRepository.save(permission);
    }
    async deletePermission(id) {
        const result = await this.permissionRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Permission with ID ${id} not found.`);
        }
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map