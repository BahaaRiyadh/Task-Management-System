import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private client: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; hash?: string }) {
    const admin = await this.client.query(
      `SELECT * FROM "Admin" WHERE "name" = $1 AND "password" = $2`,
      [payload.sub, payload.hash],
    );
    console.log('JWT validation...');

    if (!admin)
      throw new UnauthorizedException({
        message: ['Please log in to continue'],
      });

    return admin;
  }
}
