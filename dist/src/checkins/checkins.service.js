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
import { eq, sql, and, gte, lte, desc } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module.js';
import { checkinLogs, memberProfiles, packages } from '../db/schema/index.js';
let CheckinsService = class CheckinsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async processScan(memberId, adminUserId) {
        const [member] = await this.db
            .select({
            id: memberProfiles.id,
            memberId: memberProfiles.memberId,
            fullName: memberProfiles.fullName,
            remainingSessions: memberProfiles.remainingSessions,
            expiryDate: memberProfiles.expiryDate,
            status: memberProfiles.status,
            packageName: packages.name,
            packageCategory: packages.category,
        })
            .from(memberProfiles)
            .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
            .where(eq(memberProfiles.memberId, memberId.toUpperCase().trim()))
            .limit(1);
        if (!member) {
            return {
                success: false,
                name: 'Member Tidak Dikenal',
                plan: '-',
                sessions: { old: 0, new: 0 },
                expiry: '-',
                message: 'Barcode tidak valid. Member tidak ditemukan.',
            };
        }
        const today = new Date();
        const expiryDate = new Date(member.expiryDate);
        const isExpired = expiryDate < today;
        const noSessions = member.remainingSessions <= 0;
        const hour = today.getHours();
        const sessionType = hour < 12 ? 'Sesi Pagi' : 'Sesi Sore';
        if (isExpired || noSessions) {
            await this.db.insert(checkinLogs).values({
                memberProfileId: member.id,
                status: 'Gagal',
                sessionType,
                sessionsBeforeCheckin: member.remainingSessions,
                sessionsAfterCheckin: member.remainingSessions,
                remarks: isExpired ? 'Paket expired' : 'Sesi habis',
                createdBy: adminUserId,
            });
            return {
                success: false,
                name: member.fullName,
                plan: member.packageCategory || '-',
                sessions: {
                    old: member.remainingSessions,
                    new: member.remainingSessions,
                },
                expiry: member.expiryDate,
                message: isExpired
                    ? 'Paket telah expired. Silakan perpanjang.'
                    : 'Sesi latihan telah habis. Silakan perpanjang paket.',
            };
        }
        const newSessions = member.remainingSessions - 1;
        let newStatus = 'Aktif';
        if (newSessions === 0) {
            newStatus = 'Warning';
        }
        await this.db
            .update(memberProfiles)
            .set({
            remainingSessions: newSessions,
            status: newStatus,
            updatedAt: new Date(),
        })
            .where(eq(memberProfiles.id, member.id));
        await this.db.insert(checkinLogs).values({
            memberProfileId: member.id,
            status: 'Berhasil',
            sessionType,
            sessionsBeforeCheckin: member.remainingSessions,
            sessionsAfterCheckin: newSessions,
            createdBy: adminUserId,
        });
        return {
            success: true,
            name: member.fullName,
            plan: member.packageCategory || '-',
            sessions: { old: member.remainingSessions, new: newSessions },
            expiry: member.expiryDate,
        };
    }
    async getToday() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        return this.db
            .select({
            id: checkinLogs.id,
            checkinTime: checkinLogs.checkinTime,
            status: checkinLogs.status,
            sessionType: checkinLogs.sessionType,
            sessionsBefore: checkinLogs.sessionsBeforeCheckin,
            sessionsAfter: checkinLogs.sessionsAfterCheckin,
            memberName: memberProfiles.fullName,
            packageName: packages.name,
        })
            .from(checkinLogs)
            .innerJoin(memberProfiles, eq(checkinLogs.memberProfileId, memberProfiles.id))
            .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
            .where(and(gte(checkinLogs.checkinTime, todayStart), lte(checkinLogs.checkinTime, todayEnd)))
            .orderBy(desc(checkinLogs.checkinTime));
    }
    async findAll(params) {
        const { startDate, endDate, page = 1, limit = 20 } = params;
        const conditions = [];
        if (startDate) {
            conditions.push(gte(checkinLogs.checkinTime, new Date(startDate)));
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            conditions.push(lte(checkinLogs.checkinTime, end));
        }
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
        const data = await this.db
            .select({
            id: checkinLogs.id,
            checkinTime: checkinLogs.checkinTime,
            status: checkinLogs.status,
            sessionType: checkinLogs.sessionType,
            sessionsBefore: checkinLogs.sessionsBeforeCheckin,
            sessionsAfter: checkinLogs.sessionsAfterCheckin,
            remarks: checkinLogs.remarks,
            memberName: memberProfiles.fullName,
            memberId: memberProfiles.memberId,
            packageName: packages.name,
        })
            .from(checkinLogs)
            .innerJoin(memberProfiles, eq(checkinLogs.memberProfileId, memberProfiles.id))
            .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
            .where(whereClause)
            .orderBy(desc(checkinLogs.checkinTime))
            .limit(limit)
            .offset((page - 1) * limit);
        const [countResult] = await this.db
            .select({ count: sql `count(*)` })
            .from(checkinLogs)
            .where(whereClause);
        return {
            data,
            total: Number(countResult?.count) || 0,
            page,
            limit,
        };
    }
    async findByMemberProfileId(memberProfileId, params) {
        const { page = 1, limit = 10 } = params;
        const data = await this.db
            .select({
            id: checkinLogs.id,
            checkinTime: checkinLogs.checkinTime,
            status: checkinLogs.status,
            sessionType: checkinLogs.sessionType,
            sessionsAfterCheckin: checkinLogs.sessionsAfterCheckin,
            remarks: checkinLogs.remarks,
        })
            .from(checkinLogs)
            .where(eq(checkinLogs.memberProfileId, memberProfileId))
            .orderBy(desc(checkinLogs.checkinTime))
            .limit(limit)
            .offset((page - 1) * limit);
        const [countResult] = await this.db
            .select({ count: sql `count(*)` })
            .from(checkinLogs)
            .where(eq(checkinLogs.memberProfileId, memberProfileId));
        return {
            data,
            total: Number(countResult?.count) || 0,
            page,
            limit,
        };
    }
};
CheckinsService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], CheckinsService);
export { CheckinsService };
//# sourceMappingURL=checkins.service.js.map