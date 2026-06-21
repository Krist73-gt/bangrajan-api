import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class CheckinsService {
    private db;
    constructor(db: DrizzleDB);
    processScan(memberId: string, adminUserId: string): Promise<{
        success: boolean;
        name: string;
        plan: string;
        sessions: {
            old: number;
            new: number;
        };
        expiry: string;
        message: string;
    } | {
        success: boolean;
        name: string;
        plan: string;
        sessions: {
            old: number;
            new: number;
        };
        expiry: string;
        message?: undefined;
    }>;
    getToday(): Promise<{
        id: number;
        checkinTime: Date;
        status: string;
        sessionType: string | null;
        sessionsBefore: number | null;
        sessionsAfter: number | null;
        memberName: string;
        packageName: string | null;
    }[]>;
    findAll(params: {
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: number;
            checkinTime: Date;
            status: string;
            sessionType: string | null;
            sessionsBefore: number | null;
            sessionsAfter: number | null;
            remarks: string | null;
            memberName: string;
            memberId: string;
            packageName: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByMemberProfileId(memberProfileId: number, params: {
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: number;
            checkinTime: Date;
            status: string;
            sessionType: string | null;
            sessionsAfterCheckin: number | null;
            remarks: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
}
