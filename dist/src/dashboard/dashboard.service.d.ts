import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class DashboardService {
    private db;
    constructor(db: DrizzleDB);
    getAdminStats(): Promise<{
        totalMembers: number;
        todayCheckins: number;
        expiringSoon: number;
        newMembersThisMonth: number;
        recentCheckins: {
            memberName: string;
            checkinTime: Date;
            status: string;
            sessions: number | null;
            packageName: string | null;
        }[];
        expiringMembers: {
            fullName: string;
            daysLeft: number;
            remainingSessions: number;
            packageName: string | null;
        }[];
    }>;
    getMemberStats(userId: string): Promise<{
        fullName: string;
        barcode: string;
        remainingSessions: number;
        totalSessions: number;
        expiryDate: string;
        status: string;
        packageName: string;
        totalTrainingThisMonth: number;
        avgPerWeek: number;
        recentLogs: {
            id: number;
            checkinTime: Date;
            status: string;
            sessionType: string | null;
            sessionsAfterCheckin: number | null;
            remarks: string | null;
            packageName: string | null;
        }[];
    }>;
}
