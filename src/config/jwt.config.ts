import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtConfig(
  configService: ConfigService,
): Promise<JwtModuleOptions> {
  return {
    secret: configService.getOrThrow('JWT_ACCESS_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRE'),
    },
  };
}
