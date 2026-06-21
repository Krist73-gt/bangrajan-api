import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { MembersService } from '../members/members.service.js';
export declare class AuthController implements OnModuleInit {
    private readonly configService;
    private readonly membersService;
    private auth;
    constructor(configService: ConfigService, membersService: MembersService);
    onModuleInit(): void;
    handleAuth(req: Request, res: Response): Promise<void>;
}
