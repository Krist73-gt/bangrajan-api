import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { eq, sql, and, gte, lte, desc } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { checkinLogs, memberProfiles, packages } from '../db/schema/index.js';

@Injectable()
export class CheckinsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /**
   * Process a check-in scan.
   * Validates member, deducts session, and logs the result.
   */
  async processScan(memberId: string, adminUserId: string) {
    // Find member by barcode/member ID
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
      // Log failed attempt (unknown member)
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

    // Check for Cooldown (90 minutes)
    const [lastCheckin] = await this.db
      .select({ checkinTime: checkinLogs.checkinTime })
      .from(checkinLogs)
      .where(
        and(
          eq(checkinLogs.memberProfileId, member.id),
          eq(checkinLogs.status, 'Berhasil')
        )
      )
      .orderBy(desc(checkinLogs.checkinTime))
      .limit(1);

    if (lastCheckin) {
      const diffMs = today.getTime() - lastCheckin.checkinTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 90) {
        return {
          success: false,
          name: member.fullName,
          plan: member.packageCategory || '-',
          sessions: {
            old: member.remainingSessions,
            new: member.remainingSessions,
          },
          expiry: member.expiryDate,
          message: `Cooldown aktif. Member baru saja absen. Silakan tunggu ${90 - diffMins} menit lagi.`,
        };
      }
    }

    const expiryDate = new Date(member.expiryDate);
    const isExpired = expiryDate < today;
    const noSessions = member.remainingSessions <= 0;

    // Determine session type based on time
    const hour = today.getHours();
    const sessionType = hour < 12 ? 'Sesi Pagi' : 'Sesi Sore';

    if (isExpired || noSessions) {
      // Log failed check-in
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

    // Success — deduct session
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

    // Log successful check-in
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

  /**
   * Get today's check-ins
   */
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
      .innerJoin(
        memberProfiles,
        eq(checkinLogs.memberProfileId, memberProfiles.id),
      )
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(
        and(
          gte(checkinLogs.checkinTime, todayStart),
          lte(checkinLogs.checkinTime, todayEnd),
        ),
      )
      .orderBy(desc(checkinLogs.checkinTime));
  }

  /**
   * Get all check-ins with date range filter and pagination
   */
  async findAll(params: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const { startDate, endDate, page = 1, limit = 20 } = params;
    const conditions: any[] = [];

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
      .innerJoin(
        memberProfiles,
        eq(checkinLogs.memberProfileId, memberProfiles.id),
      )
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(whereClause)
      .orderBy(desc(checkinLogs.checkinTime))
      .limit(limit)
      .offset((page - 1) * limit);

    const [countResult] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(checkinLogs)
      .where(whereClause);

    return {
      data,
      total: Number(countResult?.count) || 0,
      page,
      limit,
    };
  }

  /**
   * Get check-in logs for a specific member (for member training log page)
   */
  async findByMemberProfileId(
    memberProfileId: number,
    params: {
      page?: number;
      limit?: number;
    },
  ) {
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
      .select({ count: sql<number>`count(*)` })
      .from(checkinLogs)
      .where(eq(checkinLogs.memberProfileId, memberProfileId));

    return {
      data,
      total: Number(countResult?.count) || 0,
      page,
      limit,
    };
  }
}
