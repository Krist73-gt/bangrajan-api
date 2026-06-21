import { Inject, Injectable } from '@nestjs/common';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { checkinLogs, memberProfiles, packages } from '../db/schema/index.js';

@Injectable()
export class ReportsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /**
   * Get attendance report for a given month/year.
   * Joins checkin_logs with member_profiles.
   */
  async getAttendanceReport(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const rows = await this.db
      .select({
        memberName: memberProfiles.fullName,
        memberId: memberProfiles.memberId,
        checkinDate: sql<string>`to_char(${checkinLogs.checkinTime}, 'YYYY-MM-DD')`,
        checkinTime: sql<string>`to_char(${checkinLogs.checkinTime}, 'HH24:MI:SS')`,
        status: checkinLogs.status,
        sessionType: checkinLogs.sessionType,
        remarks: checkinLogs.remarks,
      })
      .from(checkinLogs)
      .innerJoin(
        memberProfiles,
        eq(checkinLogs.memberProfileId, memberProfiles.id),
      )
      .where(
        and(
          gte(checkinLogs.checkinTime, startDate),
          lte(checkinLogs.checkinTime, endDate),
        ),
      )
      .orderBy(checkinLogs.checkinTime);

    return rows;
  }

  /**
   * Get members report, optionally filtered by status.
   * Joins member_profiles with packages.
   */
  async getMembersReport(status?: string) {
    const conditions =
      status && status.toLowerCase() !== 'all'
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
}
