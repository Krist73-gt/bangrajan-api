import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class ReportsService {
    private db;
    constructor(db: DrizzleDB);
    getAttendanceReport(month: number, year: number): Promise<{
        memberName: string;
        memberId: string;
        checkinDate: string;
        checkinTime: string;
        status: string;
        sessionType: string | null;
        remarks: string | null;
    }[]>;
    getMembersReport(status?: string): Promise<{
        memberId: string;
        fullName: string;
        phone: string | null;
        packageName: string | null;
        packageCategory: string | null;
        remainingSessions: number;
        expiryDate: string;
        status: string;
        createdAt: Date;
    }[]>;
}
