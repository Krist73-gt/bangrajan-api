import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import { packages } from '../db/schema/index.js';

@Injectable()
export class PackagesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll() {
    return this.db
      .select()
      .from(packages)
      .where(eq(packages.isActive, true))
      .orderBy(packages.sortOrder);
  }

  async findOne(id: number) {
    const [pkg] = await this.db
      .select()
      .from(packages)
      .where(eq(packages.id, id))
      .limit(1);
    if (!pkg) throw new NotFoundException('Paket tidak ditemukan.');
    return pkg;
  }

  async create(data: {
    name: string;
    category: string;
    defaultSessions: number;
    validityDays?: number;
    price: number;
    sortOrder?: number;
  }) {
    const [created] = await this.db
      .insert(packages)
      .values({
        name: data.name,
        category: data.category,
        defaultSessions: data.defaultSessions,
        validityDays: data.validityDays ?? 30,
        price: data.price,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    return created;
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      category: string;
      defaultSessions: number;
      validityDays: number;
      price: number;
      isActive: boolean;
      sortOrder: number;
    }>,
  ) {
    const [updated] = await this.db
      .update(packages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(packages.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Paket tidak ditemukan.');
    return updated;
  }

  async softDelete(id: number) {
    const [deleted] = await this.db
      .update(packages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(packages.id, id))
      .returning();
    if (!deleted) throw new NotFoundException('Paket tidak ditemukan.');
    return { message: 'Paket berhasil dinonaktifkan.' };
  }
}
