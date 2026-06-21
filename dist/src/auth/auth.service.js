var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAuth, getAuth } from '../config/auth.config.js';
let AuthService = class AuthService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        createAuth(this.configService.get('DATABASE_URL'), this.configService.get('BETTER_AUTH_URL'), this.configService.get('BETTER_AUTH_SECRET'));
    }
    getAuth() {
        return getAuth();
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map