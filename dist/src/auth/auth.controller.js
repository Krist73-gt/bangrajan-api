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
import { Controller, All, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAuth } from '../config/auth.config.js';
import { MembersService } from '../members/members.service.js';
let AuthController = class AuthController {
    configService;
    membersService;
    auth;
    constructor(configService, membersService) {
        this.configService = configService;
        this.membersService = membersService;
    }
    onModuleInit() {
        this.auth = createAuth(this.configService.get('DATABASE_URL'), this.configService.get('BETTER_AUTH_URL'), this.configService.get('BETTER_AUTH_SECRET'));
    }
    async handleAuth(req, res) {
        const protocol = req.protocol;
        const host = req.get('host') || 'localhost:3001';
        let originalUrl = req.originalUrl;
        if (originalUrl.includes('/forget-password')) {
            originalUrl = originalUrl.replace('/forget-password', '/request-password-reset');
        }
        const url = new URL(originalUrl, `${protocol}://${host}`);
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach((v) => headers.append(key, v));
                }
                else {
                    headers.set(key, value);
                }
            }
        }
        console.log(`[AuthController] Proxying ${req.method} ${url.toString()}`);
        if (req.body) {
            console.log(`[AuthController] Body:`, JSON.stringify(req.body));
        }
        const webRequest = new globalThis.Request(url.toString(), {
            method: req.method,
            headers,
            body: ['GET', 'HEAD'].includes(req.method)
                ? undefined
                : JSON.stringify(req.body),
        });
        let response;
        try {
            response = await this.auth.handler(webRequest);
            console.log(`[AuthController] Response status: ${response.status}`);
        }
        catch (err) {
            console.error('[AuthController] Error in better-auth handler:', err);
            throw err;
        }
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        res.status(response.status);
        const body = await response.text();
        try {
            if (req.originalUrl.includes('/api/auth/sign-up/email') &&
                req.method === 'POST' &&
                response.status === 200) {
                const parsedBody = JSON.parse(body);
                if (parsedBody && parsedBody.user && parsedBody.user.id) {
                    console.log('[AuthController] Intercepted new user sign up:', parsedBody.user.id);
                    this.membersService
                        .createPendingProfileForNewUser(parsedBody.user)
                        .catch((err) => {
                        console.error('[AuthController] Failed to auto-create profile:', err);
                    });
                }
            }
        }
        catch (err) {
            console.error('[AuthController] Interceptor error:', err);
        }
        res.send(body);
    }
};
__decorate([
    All('*path'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleAuth", null);
AuthController = __decorate([
    Controller('api/auth'),
    __metadata("design:paramtypes", [ConfigService,
        MembersService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map