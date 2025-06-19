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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jsonwebtoken_1 = require("jsonwebtoken");
const dayjs = require("dayjs");
const config_1 = require("@nestjs/config");
let JwtService = class JwtService {
    constructor(configService) {
        this.configService = configService;
        this.config = {
            auth: {
                secret: this.configService.get('JWT_AUTH_SECRET', 'authSecretFallback'),
                expiresIn: '15m',
            },
            refresh: {
                secret: this.configService.get('JWT_REFRESH_SECRET', 'refreshSecretFallback'),
                expiresIn: '1d',
            },
        };
    }
    generateToken(payload, type = 'auth') {
        return (0, jsonwebtoken_1.sign)(payload, this.config[type].secret, {
            expiresIn: this.config[type].expiresIn,
        });
    }
    refreshToken(refreshToken) {
        try {
            const payload = this.getPayload(refreshToken, 'refresh');
            const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), 'minute');
            return {
                accessToken: this.generateToken({ email: payload.email }),
                refreshToken: timeToExpire < 20
                    ? this.generateToken({ email: payload.email }, 'refresh')
                    : refreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token.');
        }
    }
    getPayload(token, type = 'auth') {
        try {
            return (0, jsonwebtoken_1.verify)(token, this.config[type].secret);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token.');
        }
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map