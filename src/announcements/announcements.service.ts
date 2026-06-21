import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { announcements } from '../db/schema/index.js';

@Injectable()
export class AnnouncementsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(onlyActive = true) {
    const query = this.db.select().from(announcements);
    if (onlyActive) {
      return query
        .where(eq(announcements.isActive, true))
        .orderBy(desc(announcements.createdAt));
    }
    return query.orderBy(desc(announcements.createdAt));
  }

  async findOne(id: number) {
    const [item] = await this.db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id))
      .limit(1);
    if (!item) throw new NotFoundException('Pengumuman tidak ditemukan.');
    return item;
  }

  async create(data: {
    title: string;
    content: string;
    type: string;
    createdBy: string;
  }) {
    const [created] = await this.db
      .insert(announcements)
      .values({
        title: data.title,
        content: data.content,
        type: data.type || 'Info',
        createdBy: data.createdBy,
      })
      .returning();
    return created;
  }

  async update(
    id: number,
    data: Partial<{
      title: string;
      content: string;
      type: string;
      isActive: boolean;
    }>,
  ) {
    const [updated] = await this.db
      .update(announcements)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(announcements.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Pengumuman tidak ditemukan.');
    return updated;
  }

  async remove(id: number) {
    const [deleted] = await this.db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Pengumuman tidak ditemukan.');
    return { message: 'Pengumuman berhasil dihapus.' };
  }
}
