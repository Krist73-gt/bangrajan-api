import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class AnnouncementsService {
    private db;
    constructor(db: DrizzleDB);
    findAll(onlyActive?: boolean): Promise<{
        id: number;
        title: string;
        content: string;
        type: string;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        content: string;
        type: string;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: {
        title: string;
        content: string;
        type: string;
        createdBy: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        createdBy: string | null;
        title: string;
        content: string;
        type: string;
    }>;
    update(id: number, data: Partial<{
        title: string;
        content: string;
        type: string;
        isActive: boolean;
    }>): Promise<{
        id: number;
        title: string;
        content: string;
        type: string;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
