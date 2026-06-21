import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AuthService implements OnModuleInit {
    private readonly configService;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getAuth(): any;
}
