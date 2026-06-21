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
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, gte, lte, desc, count } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module.js';
import { memberProfiles, checkinLogs, packages } from '../db/schema/index.js';
let DashboardService = class DashboardService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getAdminStats() {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        const todayDateStr = now.toISOString().slice(0, 10);
        const threeDaysLater = new Date(now);
        threeDaysLater.setDate(threeDaysLater.getDate() + 3);
        const threeDaysStr = threeDaysLater.toISOString().slice(0, 10);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [[totalMembersResult], [todayCheckinsResult], [expiringSoonResult], [newMembersResult], recentCheckins, expiringMembers,] = await Promise.all([
            this.db.select({ count: count() }).from(memberProfiles),
            this.db
                .select({ count: count() })
                .from(checkinLogs)
                .where(and(gte(checkinLogs.checkinTime, todayStart), lte(checkinLogs.checkinTime, todayEnd))),
            this.db
                .select({ count: count() })
                .from(memberProfiles)
                .where(and(gte(memberProfiles.expiryDate, todayDateStr), lte(memberProfiles.expiryDate, threeDaysStr))),
            this.db
                .select({ count: count() })
                .from(memberProfiles)
                .where(gte(memberProfiles.createdAt, monthStart)),
            this.db
                .select({
                id: checkinLogs.id,
                memberName: memberProfiles.fullName,
                checkinTime: checkinLogs.checkinTime,
                status: checkinLogs.status,
                sessionsAfter: checkinLogs.sessionsAfterCheckin,
                packageName: packages.name,
            })
                .from(checkinLogs)
                .innerJoin(memberProfiles, eq(checkinLogs.memberProfileId, memberProfiles.id))
                .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
                .where(and(gte(checkinLogs.checkinTime, todayStart), lte(checkinLogs.checkinTime, todayEnd)))
                .orderBy(desc(checkinLogs.checkinTime))
                .limit(5),
            this.db
                .select({
                id: memberProfiles.id,
                fullName: memberProfiles.fullName,
                expiryDate: memberProfiles.expiryDate,
                remainingSessions: memberProfiles.remainingSessions,
                packageName: packages.name,
            })
                .from(memberProfiles)
                .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
                .where(and(gte(memberProfiles.expiryDate, todayDateStr), lte(memberProfiles.expiryDate, threeDaysStr)))
                .orderBy(memberProfiles.expiryDate),
        ]);
        return {
            totalMembers: totalMembersResult?.count ?? 0,
            todayCheckins: todayCheckinsResult?.count ?? 0,
            expiringSoon: expiringSoonResult?.count ?? 0,
            newMembersThisMonth: newMembersResult?.count ?? 0,
            recentCheckins: recentCheckins.map((c) => ({
                memberName: c.memberName,
                checkinTime: c.checkinTime,
                status: c.status,
                sessions: c.sessionsAfter,
                packageName: c.packageName,
            })),
            expiringMembers: expiringMembers.map((m) => {
                const expiry = new Date(m.expiryDate);
                const diffMs = expiry.getTime() - now.getTime();
                const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                return {
                    fullName: m.fullName,
                    daysLeft,
                    remainingSessions: m.remainingSessions,
                    packageName: m.packageName,
                };
            }),
        };
    }
    async getMemberStats(userId) {
        const [member] = await this.db
            .select({
            id: memberProfiles.id,
            fullName: memberProfiles.fullName,
            barcode: memberProfiles.memberId,
            remainingSessions: memberProfiles.remainingSessions,
            expiryDate: memberProfiles.expiryDate,
            status: memberProfiles.status,
            packageId: memberProfiles.packageId,
            totalSessions: packages.defaultSessions,
            packageName: packages.name,
        })
            .from(memberProfiles)
            .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
            .where(eq(memberProfiles.userId, userId))
            .limit(1);
        if (!member) {
            throw new NotFoundException('Profil member tidak ditemukan.');
        }
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [trainingResult] = await this.db
            .select({ count: count() })
            .from(checkinLogs)
            .where(and(eq(checkinLogs.memberProfileId, member.id), eq(checkinLogs.status, 'Berhasil'), gte(checkinLogs.checkinTime, monthStart)));
        const totalTrainingThisMonth = trainingResult?.count ?? 0;
        const dayOfMonth = now.getDate();
        const weeksElapsed = Math.max(1, Math.ceil(dayOfMonth / 7));
        const avgPerWeek = Math.round((totalTrainingThisMonth / weeksElapsed) * 10) / 10;
        const recentLogs = await this.db
            .select({
            id: checkinLogs.id,
            checkinTime: checkinLogs.checkinTime,
            status: checkinLogs.status,
            sessionType: checkinLogs.sessionType,
            sessionsAfterCheckin: checkinLogs.sessionsAfterCheckin,
            remarks: checkinLogs.remarks,
            packageName: packages.name,
        })
            .from(checkinLogs)
            .leftJoin(memberProfiles, eq(checkinLogs.memberProfileId, memberProfiles.id))
            .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
            .where(eq(checkinLogs.memberProfileId, member.id))
            .orderBy(desc(checkinLogs.checkinTime))
            .limit(20);
        return {
            fullName: member.fullName,
            barcode: member.barcode,
            remainingSessions: member.remainingSessions,
            totalSessions: member.totalSessions ?? 0,
            expiryDate: member.expiryDate,
            status: member.status,
            packageName: member.packageName ?? '-',
            totalTrainingThisMonth,
            avgPerWeek,
            recentLogs,
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], DashboardService);
export { DashboardService };
//# sourceMappingURL=dashboard.service.js.map