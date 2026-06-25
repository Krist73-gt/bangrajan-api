import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq, like, sql, and, lte, gt, gte, desc } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { memberProfiles, packages, transactions, checkinLogs, user } from '../db/schema/index.js';

@Injectable()
export class MembersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  // ─── Generate Member ID ──────────────────────────────────
  private async generateMemberId(): Promise<string> {
    const year = new Date().getFullYear();
    const [result] = await this.db
      .select({ maxMemberId: sql<string>`max(member_id)` })
      .from(memberProfiles)
      .where(like(memberProfiles.memberId, `BR-${year}-%`));

    let seq = 1;
    if (result?.maxMemberId) {
      const parts = result.maxMemberId.split('-');
      if (parts.length === 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }
    return `BR-${year}-${String(seq).padStart(4, '0')}`;
  }

  // ─── Find All (with search & filter) ─────────────────────
  async findAll(params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, status, page = 1, limit = 20 } = params;
    const conditions: any[] = [];

    if (search) {
      conditions.push(like(memberProfiles.fullName, `%${search}%`));
    }
    if (status && status !== 'all') {
      conditions.push(eq(memberProfiles.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await this.db
      .select({
        id: memberProfiles.id,
        memberId: memberProfiles.memberId,
        fullName: memberProfiles.fullName,
        phone: memberProfiles.phone,
        remainingSessions: memberProfiles.remainingSessions,
        expiryDate: memberProfiles.expiryDate,
        status: memberProfiles.status,
        packageName: packages.name,
        packageCategory: packages.category,
        createdAt: memberProfiles.createdAt,
      })
      .from(memberProfiles)
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(whereClause)
      .orderBy(desc(memberProfiles.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [countResult] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(memberProfiles)
      .where(whereClause);

    return {
      data,
      total: Number(countResult?.count) || 0,
      page,
      limit,
    };
  }

  // ─── Find One ────────────────────────────────────────────
  async findOne(id: number) {
    const [member] = await this.db
      .select({
        id: memberProfiles.id,
        userId: memberProfiles.userId,
        memberId: memberProfiles.memberId,
        fullName: memberProfiles.fullName,
        phone: memberProfiles.phone,
        remainingSessions: memberProfiles.remainingSessions,
        expiryDate: memberProfiles.expiryDate,
        status: memberProfiles.status,
        packageId: memberProfiles.packageId,
        packageName: packages.name,
        packageCategory: packages.category,
        createdAt: memberProfiles.createdAt,
        updatedAt: memberProfiles.updatedAt,
      })
      .from(memberProfiles)
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(eq(memberProfiles.id, id))
      .limit(1);

    if (!member) throw new NotFoundException('Member tidak ditemukan.');
    return member;
  }

  // ─── Create ──────────────────────────────────────────────
  async create(data: {
    fullName: string;
    phone?: string;
    packageId: number;
    expiryDate: string;
    remainingSessions: number;
  }) {
    const memberId = await this.generateMemberId();

    const [created] = await this.db
      .insert(memberProfiles)
      .values({
        memberId,
        fullName: data.fullName,
        phone: data.phone,
        packageId: data.packageId,
        expiryDate: data.expiryDate,
        remainingSessions: data.remainingSessions,
        status: data.remainingSessions > 0 ? 'Aktif' : 'Expired',
      })
      .returning();

    return created;
  }

  // ─── Auto-Create Pending Profile (on Registration) ────────
  async createPendingProfileForNewUser(user: any) {
    console.log(
      '[MembersService] Triggered createPendingProfileForNewUser for:',
      user.id,
    );
    let existingMember = null;
    if (user.phone) {
      const [found] = await this.db
        .select()
        .from(memberProfiles)
        .where(eq(memberProfiles.phone, user.phone))
        .limit(1);
      existingMember = found;
      console.log(
        '[MembersService] Checked phone',
        user.phone,
        'Found:',
        !!existingMember,
      );
    }

    if (existingMember) {
      console.log(
        '[MembersService] Linking existing member:',
        existingMember.id,
      );
      await this.db
        .update(memberProfiles)
        .set({ userId: user.id })
        .where(eq(memberProfiles.id, existingMember.id));
    } else {
      console.log('[MembersService] Creating new pending member profile');
      const memberIdStr = await this.generateMemberId();
      const today = new Date().toISOString().split('T')[0];

      const [insertResult] = await this.db
        .insert(memberProfiles)
        .values({
          memberId: memberIdStr,
          userId: user.id,
          fullName: user.name || 'Member Baru',
          phone: user.phone || null,
          remainingSessions: 0,
          expiryDate: today,
          status: 'Pending',
        })
        .returning();
      console.log(
        '[MembersService] Successfully created member profile ID:',
        insertResult.id,
      );
    }
  }

  // ─── Update Profile ──────────────────────────────────────
  async update(id: number, data: Partial<{ fullName: string; phone: string }>) {
    const [updated] = await this.db
      .update(memberProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(memberProfiles.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Member tidak ditemukan.');
    return updated;
  }

  // ─── Renew Package ───────────────────────────────────────
  async renewPackage(
    id: number,
    data: { packageId: number },
    adminUserId: string,
  ) {
    // Get current member
    const [member] = await this.db
      .select()
      .from(memberProfiles)
      .where(eq(memberProfiles.id, id))
      .limit(1);
    if (!member) throw new NotFoundException('Member tidak ditemukan.');

    // Get package info
    const [pkg] = await this.db
      .select()
      .from(packages)
      .where(eq(packages.id, data.packageId))
      .limit(1);
    if (!pkg) throw new NotFoundException('Paket tidak ditemukan.');

    // Calculate new sessions & expiry
    const newSessions = member.remainingSessions + pkg.defaultSessions;
    const currentExpiry = new Date(member.expiryDate);
    const baseDate = currentExpiry < new Date() ? new Date() : currentExpiry;
    const newExpiry = new Date(baseDate);
    newExpiry.setDate(newExpiry.getDate() + (pkg.validityDays || 30));
    const newExpiryStr = newExpiry.toISOString().split('T')[0];

    // Update member
    await this.db
      .update(memberProfiles)
      .set({
        packageId: data.packageId,
        remainingSessions: newSessions,
        expiryDate: newExpiryStr,
        status: 'Aktif',
        updatedAt: new Date(),
      })
      .where(eq(memberProfiles.id, id));

    // Record transaction
    await this.db.insert(transactions).values({
      memberProfileId: id,
      packageId: data.packageId,
      actionType: 'renew',
      sessionsDelta: pkg.defaultSessions,
      previousExpiry: member.expiryDate,
      newExpiry: newExpiryStr,
      notes: `Perpanjangan paket ${pkg.category} - ${pkg.name}`,
      createdBy: adminUserId,
    });

    return {
      message: 'Paket berhasil diperpanjang.',
      sessions: { old: member.remainingSessions, new: newSessions },
      expiry: { old: member.expiryDate, new: newExpiryStr },
    };
  }

  // ─── Adjust Sessions ─────────────────────────────────────
  async adjustSessions(
    id: number,
    data: { delta: number; notes?: string },
    adminUserId: string,
  ) {
    const [member] = await this.db
      .select()
      .from(memberProfiles)
      .where(eq(memberProfiles.id, id))
      .limit(1);
    if (!member) throw new NotFoundException('Member tidak ditemukan.');

    const newSessions = Math.max(0, member.remainingSessions + data.delta);
    let newStatus = member.status;
    if (newSessions === 0) {
      newStatus =
        new Date(member.expiryDate) < new Date() ? 'Expired' : 'Warning';
    } else {
      newStatus = 'Aktif';
    }

    await this.db
      .update(memberProfiles)
      .set({
        remainingSessions: newSessions,
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(memberProfiles.id, id));

    // Record transaction
    await this.db.insert(transactions).values({
      memberProfileId: id,
      actionType: data.delta > 0 ? 'add_session' : 'reduce_session',
      sessionsDelta: data.delta,
      notes:
        data.notes ||
        `Penyesuaian manual: ${data.delta > 0 ? '+' : ''}${data.delta} sesi`,
      createdBy: adminUserId,
    });

    return {
      message: `Sesi berhasil disesuaikan.`,
      sessions: { old: member.remainingSessions, new: newSessions },
      status: newStatus,
    };
  }

  // ─── Get Expiring Soon (H-3) ─────────────────────────────
  async getExpiringSoon() {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    return this.db
      .select({
        id: memberProfiles.id,
        fullName: memberProfiles.fullName,
        remainingSessions: memberProfiles.remainingSessions,
        expiryDate: memberProfiles.expiryDate,
        status: memberProfiles.status,
        packageName: packages.name,
      })
      .from(memberProfiles)
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(
        and(
          gte(memberProfiles.expiryDate, today.toISOString().split('T')[0]),
          lte(
            memberProfiles.expiryDate,
            threeDaysLater.toISOString().split('T')[0],
          ),
        ),
      )
      .orderBy(memberProfiles.expiryDate);
  }

  // ─── Find by Member ID (barcode) ─────────────────────────
  async findByMemberId(memberId: string) {
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
      .where(eq(memberProfiles.memberId, memberId))
      .limit(1);
    return member || null;
  }

  // ─── Find by User ID (for member dashboard) ──────────────
  async findByUserId(userId: string) {
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
        packageDefaultSessions: packages.defaultSessions,
      })
      .from(memberProfiles)
      .leftJoin(packages, eq(memberProfiles.packageId, packages.id))
      .where(eq(memberProfiles.userId, userId))
      .limit(1);
    return member || null;
  }

  // ─── Get Activity History (Audit Log) ────────────────────
  async getActivityHistory(memberProfileId: number) {
    // Get Checkins
    const checkins = await this.db
      .select({
        id: checkinLogs.id,
        type: sql<string>`'checkin'`,
        action: checkinLogs.status,
        description: checkinLogs.sessionType,
        createdAt: checkinLogs.createdAt,
        createdBy: user.name,
      })
      .from(checkinLogs)
      .leftJoin(user, eq(checkinLogs.createdBy, user.id))
      .where(eq(checkinLogs.memberProfileId, memberProfileId));

    // Get Transactions
    const trans = await this.db
      .select({
        id: transactions.id,
        type: sql<string>`'transaction'`,
        action: transactions.actionType,
        description: transactions.notes,
        createdAt: transactions.createdAt,
        createdBy: user.name,
      })
      .from(transactions)
      .leftJoin(user, eq(transactions.createdBy, user.id))
      .where(eq(transactions.memberProfileId, memberProfileId));

    // Combine and sort
    const history = [...checkins, ...trans].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return history;
  }

  // ─── Delete Member ───────────────────────────────────────
  async remove(id: number) {
    const [deleted] = await this.db
      .delete(memberProfiles)
      .where(eq(memberProfiles.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Member tidak ditemukan.');
    return { message: 'Data member berhasil dihapus.' };
  }
}
