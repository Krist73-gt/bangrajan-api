import { CheckinsService } from './checkins.service.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';
export declare class CheckinsController {
    private readonly checkinsService;
    constructor(checkinsService: CheckinsService);
    scan(body: {
        memberId: string;
    }, user: AuthUser): Promise<{
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
    findAll(startDate?: string, endDate?: string, page?: string, limit?: string): Promise<{
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
}
