"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const jwt_service_1 = require("../jwt/jwt.service");
const user_entity_1 = require("../entities/user.entity");
const users_service_1 = require("../users/users.service");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, role_entity_1.RoleEntity, permission_entity_1.PermissionEntity]),
        ],
        providers: [auth_middleware_1.AuthGuard, jwt_service_1.JwtService, users_service_1.UsersService],
        exports: [auth_middleware_1.AuthGuard, jwt_service_1.JwtService, users_service_1.UsersService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map