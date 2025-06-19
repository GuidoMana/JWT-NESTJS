import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import * as dayjs from 'dayjs';
import { Payload } from 'src/interfaces/payload';
import { ConfigService } from '@nestjs/config'; // Importar ConfigService

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {} // Inyectar ConfigService

  config = {
    auth: {
      secret: this.configService.get<string>('JWT_AUTH_SECRET', 'authSecretFallback'), // Obtener de .env, con un fallback
      expiresIn: '15m',
    },
    refresh: {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refreshSecretFallback'), // Obtener de .env, con un fallback
      expiresIn: '1d',
    },
  };

  generateToken(
    payload: { email: string },
    type: 'refresh' | 'auth' = 'auth',
  ): string {
    return sign(payload, this.config[type].secret, {
      expiresIn: this.config[type].expiresIn,
    });
  }

  refreshToken(refreshToken: string): { accessToken: string, refreshToken: string } {
    try {
      const payload = this.getPayload(refreshToken, 'refresh');
      const timeToExpire = dayjs.unix(payload.exp).diff(dayjs(), 'minute');
      return {
        accessToken: this.generateToken({ email: payload.email }),
        refreshToken:
          timeToExpire < 20
            ? this.generateToken({ email: payload.email }, 'refresh')
            : refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): Payload {
    try {
        return verify(token, this.config[type].secret) as Payload;
    } catch (error) {
        throw new UnauthorizedException('Invalid token.');
    }
  }
}