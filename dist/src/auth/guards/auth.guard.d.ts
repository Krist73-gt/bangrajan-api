import { CanActivate, ExecutionContext } from '@nestjs/common';
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    image?: string | null;
}
export declare class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
