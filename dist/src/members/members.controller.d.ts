import { MembersService } from './members.service.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    findAll(search?: string, status?: string, page?: string, limit?: string): Promise<{
        data: {
            id: number;
            memberId: string;
            fullName: string;
            phone: string | null;
            remainingSessions: number;
            expiryDate: string;
            status: string;
            packageName: string | null;
            packageCategory: string | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getExpiringSoon(): Promise<{
        id: number;
        fullName: string;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        packageName: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        userId: string | null;
        memberId: string;
        fullName: string;
        phone: string | null;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        packageId: number | null;
        packageName: string | null;
        packageCategory: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: {
        fullName: string;
        phone?: string;
        packageId: number;
        expiryDate: string;
        remainingSessions: number;
    }): Promise<{
        id: number;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        packageId: number | null;
        memberId: string;
        fullName: string;
        remainingSessions: number;
        expiryDate: string;
        status: string;
    }>;
    update(id: number, body: Partial<{
        fullName: string;
        phone: string;
    }>): Promise<{
        id: number;
        userId: string | null;
        packageId: number | null;
        memberId: string;
        fullName: string;
        phone: string | null;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    renew(id: number, body: {
        packageId: number;
    }, user: AuthUser): Promise<{
        message: string;
        sessions: {
            old: number;
            new: number;
        };
        expiry: {
            old: string;
            new: string;
        };
    }>;
    adjustSessions(id: number, body: {
        delta: number;
        notes?: string;
    }, user: AuthUser): Promise<{
        message: string;
        sessions: {
            old: number;
            new: number;
        };
        status: string;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
