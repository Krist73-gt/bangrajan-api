var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module.js';
import { checkinLogs, memberProfiles, packages } from '../db/schema/index.js';
let ReportsService = class ReportsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getAttendanceReport(month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const rows = await this.db
            .select({
            memberName: memberProfiles.fullName,
            memberId: memberProfiles.memberId,
            checkinDate: sql `to_char(${checkinLogs.checkinTime}, 'YYYY-MM-DD')`,
            checkinTime: sql `to_char(${checkinLogs.checkinTime}, 'HH24:MI:SS')`,
            status: checkinLogs.status,
            sessionType: checkinLogs.sessionType,
            remarks: checkinLogs.remarks,
        })
            .from(checkinLogs)
            .innerJoin(memberProfiles, eq(checkinLogs.memberProfileId, memberProfiles.id))
            .where(and(gte(checkinLogs.checkinTime, startDate), lte(checkinLogs.checkinTime, endDate)))
            .orderBy(checkinLogs.checkinTime);
        return rows;
    }
    async getMembersReport(status) {
        const conditions = status && status.toLowerCase() !== 'all'
            ? eq(memberProfiles.status, status)
            : undefined;
        const rows = await this.db
            .select({
            memberId: memberProfiles.memberId,
            fullName: memberProfiles.fullName,
            phone: memberProfiles.phone,
            packageName: packages.name,
            packageCategory: packages.category,
            remainingSessions: memberProfiles.remainingSessions,
            expiryDate: memberProfiles.expiryDate,
            status: memberProfiles.status,
            createdAt: memberProfiles.createdAt,
        })
            .from(memberProfiles)
            .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
            .where(conditions)
            .orderBy(memberProfiles.createdAt);
        return rows;
    }
};
ReportsService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], ReportsService);
export { ReportsService };
//# sourceMappingURL=reports.service.js.map