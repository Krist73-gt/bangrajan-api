import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAuth, getAuth } from '../config/auth.config.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    createAuth(
      this.configService.get<string>('DATABASE_URL')!,
      this.configService.get<string>('BETTER_AUTH_URL')!,
      this.configService.get<string>('BETTER_AUTH_SECRET')!,
    );
  }

  getAuth() {
    return getAuth();
  }
}
