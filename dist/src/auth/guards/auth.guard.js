var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { getAuth } from '../../config/auth.config.js';
let AuthGuard = class AuthGuard {
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const auth = getAuth();
        try {
            const headers = new Headers();
            for (const [key, value] of Object.entries(request.headers)) {
                if (value) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => headers.append(key, v));
                    }
                    else {
                        headers.set(key, value);
                    }
                }
            }
            const session = await auth.api.getSession({ headers });
            if (!session || !session.user) {
                throw new UnauthorizedException('Sesi tidak valid. Silakan login kembali.');
            }
            request.user = session.user;
            request.session = session.session;
            return true;
        }
        catch (error) {
            if (error instanceof UnauthorizedException)
                throw error;
            throw new UnauthorizedException('Sesi tidak valid. Silakan login kembali.');
        }
    }
};
AuthGuard = __decorate([
    Injectable()
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map