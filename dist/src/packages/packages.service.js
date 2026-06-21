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
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module.js';
import { packages } from '../db/schema/index.js';
let PackagesService = class PackagesService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll() {
        return this.db
            .select()
            .from(packages)
            .where(eq(packages.isActive, true))
            .orderBy(packages.sortOrder);
    }
    async findOne(id) {
        const [pkg] = await this.db
            .select()
            .from(packages)
            .where(eq(packages.id, id))
            .limit(1);
        if (!pkg)
            throw new NotFoundException('Paket tidak ditemukan.');
        return pkg;
    }
    async create(data) {
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
    async update(id, data) {
        const [updated] = await this.db
            .update(packages)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(packages.id, id))
            .returning();
        if (!updated)
            throw new NotFoundException('Paket tidak ditemukan.');
        return updated;
    }
    async softDelete(id) {
        const [deleted] = await this.db
            .update(packages)
            .set({ isActive: false, updatedAt: new Date() })
            .where(eq(packages.id, id))
            .returning();
        if (!deleted)
            throw new NotFoundException('Paket tidak ditemukan.');
        return { message: 'Paket berhasil dinonaktifkan.' };
    }
};
PackagesService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], PackagesService);
export { PackagesService };
//# sourceMappingURL=packages.service.js.map