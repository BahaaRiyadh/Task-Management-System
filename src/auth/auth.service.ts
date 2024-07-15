import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private client: DatabaseService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async login(dto: AuthDto) {
    const admin = await this.client.query(
      `SELECT * FROM "Admin" WHERE "name" = $1`,
      [dto.name],
    );
    const pwMatches = await argon.verify(admin.rows[0].password, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Incorrect Password');
    }

    return this.signToken(admin.rows[0].name, admin.rows[0].password);
  }

  async signToken(
    name: string,
    hash: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: name,
      hash,
    };
    const secret = await this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
  async findAdmin(name: string) {
    const admin = await this.client.query(
      `SELECT * FROM "Admin" WHERE "name" = $1`,
      [name],
    );
  }
}
