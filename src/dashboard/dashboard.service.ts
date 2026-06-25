import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, gte, lte, sql, desc, count } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { memberProfiles, checkinLogs, packages } from '../db/schema/index.js';

@Injectable()
export class DashboardService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /**
   * Get aggregated stats for admin dashboard
   */
  async getAdminStats() {
    const now = new Date();

    // Today boundaries
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Expiry window: today → today + 3 days
    const todayDateStr = now.toISOString().slice(0, 10);
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const threeDaysStr = threeDaysLater.toISOString().slice(0, 10);

    // Current month boundaries
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run all count queries in parallel
    const [
      [totalMembersResult],
      [todayCheckinsResult],
      [expiringSoonResult],
      [newMembersResult],
      recentCheckins,
      expiringMembers,
    ] = await Promise.all([
      // Total members
      this.db.select({ count: count() }).from(memberProfiles),

      // Today's check-ins
      this.db
        .select({ count: count() })
        .from(checkinLogs)
        .where(
          and(
            gte(checkinLogs.checkinTime, todayStart),
            lte(checkinLogs.checkinTime, todayEnd),
          ),
        ),

      // Expiring soon (within 3 days)
      this.db
        .select({ count: count() })
        .from(memberProfiles)
        .where(
          and(
            gte(memberProfiles.expiryDate, todayDateStr),
            lte(memberProfiles.expiryDate, threeDaysStr),
          ),
        ),

      // New members this month
      this.db
        .select({ count: count() })
        .from(memberProfiles)
        .where(gte(memberProfiles.createdAt, monthStart)),

      // Recent check-ins (last 5 globally)
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
        .innerJoin(
          memberProfiles,
          eq(checkinLogs.memberProfileId, memberProfiles.id),
        )
        .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
        .orderBy(desc(checkinLogs.checkinTime))
        .limit(5),

      // Members expiring within 3 days
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
        .where(
          and(
            gte(memberProfiles.expiryDate, todayDateStr),
            lte(memberProfiles.expiryDate, threeDaysStr),
          ),
        )
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

  /**
   * Get stats for a specific member's dashboard
   */
  async getMemberStats(userId: string) {
    // Find member profile by userId
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

    // Current month boundaries
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Count successful check-ins this month
    const [trainingResult] = await this.db
      .select({ count: count() })
      .from(checkinLogs)
      .where(
        and(
          eq(checkinLogs.memberProfileId, member.id),
          eq(checkinLogs.status, 'Berhasil'),
          gte(checkinLogs.checkinTime, monthStart),
        ),
      );

    const totalTrainingThisMonth = trainingResult?.count ?? 0;

    // Calculate average per week
    const dayOfMonth = now.getDate();
    const weeksElapsed = Math.max(1, Math.ceil(dayOfMonth / 7));
    const avgPerWeek =
      Math.round((totalTrainingThisMonth / weeksElapsed) * 10) / 10;

    // Recent check-in logs (increased to 20 for log page)
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
      .leftJoin(
        memberProfiles,
        eq(checkinLogs.memberProfileId, memberProfiles.id),
      )
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(eq(checkinLogs.memberProfileId, member.id))
      .orderBy(desc(checkinLogs.checkinTime))
      .limit(20);

    return {
      id: member.id,
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
}
