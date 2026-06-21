import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class PackagesService {
    private db;
    constructor(db: DrizzleDB);
    findAll(): Promise<{
        id: number;
        name: string;
        category: string;
        defaultSessions: number;
        validityDays: number;
        price: number;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        category: string;
        defaultSessions: number;
        validityDays: number;
        price: number;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: {
        name: string;
        category: string;
        defaultSessions: number;
        validityDays?: number;
        price: number;
        sortOrder?: number;
    }): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        defaultSessions: number;
        validityDays: number;
        price: number;
        isActive: boolean;
        sortOrder: number;
    }>;
    update(id: number, data: Partial<{
        name: string;
        category: string;
        defaultSessions: number;
        validityDays: number;
        price: number;
        isActive: boolean;
        sortOrder: number;
    }>): Promise<{
        id: number;
        name: string;
        category: string;
        defaultSessions: number;
        validityDays: number;
        price: number;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    softDelete(id: number): Promise<{
        message: string;
    }>;
}
