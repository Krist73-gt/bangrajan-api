import { Inject, Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { notifications } from '../db/schema/index.js';

@Injectable()
export class NotificationsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findByUserId(userId: string) {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  }

  async markAsRead(id: number, userId: string) {
    const [updated] = await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
    return { message: 'Semua notifikasi ditandai sudah dibaca.' };
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: string;
    relatedEntityId?: number;
    relatedEntityType?: string;
  }) {
    const [created] = await this.db
      .insert(notifications)
      .values(data)
      .returning();
    return created;
  }
}
