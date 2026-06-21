import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class MembersService {
    private db;
    constructor(db: DrizzleDB);
    private generateMemberId;
    findAll(params: {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
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
    create(data: {
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
    createPendingProfileForNewUser(user: any): Promise<void>;
    update(id: number, data: Partial<{
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
    renewPackage(id: number, data: {
        packageId: number;
    }, adminUserId: string): Promise<{
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
    adjustSessions(id: number, data: {
        delta: number;
        notes?: string;
    }, adminUserId: string): Promise<{
        message: string;
        sessions: {
            old: number;
            new: number;
        };
        status: string;
    }>;
    getExpiringSoon(): Promise<{
        id: number;
        fullName: string;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        packageName: string | null;
    }[]>;
    findByMemberId(memberId: string): Promise<{
        id: number;
        memberId: string;
        fullName: string;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        packageName: string | null;
        packageCategory: string | null;
    }>;
    findByUserId(userId: string): Promise<{
        id: number;
        memberId: string;
        fullName: string;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        packageName: string | null;
        packageCategory: string | null;
        packageDefaultSessions: number | null;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
