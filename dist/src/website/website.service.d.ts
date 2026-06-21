import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class WebsiteService {
    private db;
    constructor(db: DrizzleDB);
    getWebsiteStats(): Promise<{
        activeMembers: number;
    }>;
    getSchedules(): Promise<{
        id: number;
        dayName: string;
        dayOrder: number;
        openTime: string | null;
        closeTime: string | null;
        isHoliday: boolean;
        updatedAt: Date;
    }[]>;
    updateSchedules(data: Array<{
        id: number;
        openTime: string | null;
        closeTime: string | null;
        isHoliday: boolean;
    }>): Promise<{
        id: number;
        dayName: string;
        dayOrder: number;
        openTime: string | null;
        closeTime: string | null;
        isHoliday: boolean;
        updatedAt: Date;
    }[]>;
    getGalleryImages(): Promise<{
        imageUrl: string;
        id: number;
        title: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    addGalleryImage(data: {
        title: string;
        imageUrl: string;
        sortOrder?: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        isActive: boolean;
        sortOrder: number;
        title: string;
        imageUrl: string;
    }>;
    updateGalleryImage(id: number, data: Partial<{
        title: string;
        imageUrl: string;
        sortOrder: number;
    }>): Promise<{
        id: number;
        title: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    removeGalleryImage(id: number): Promise<{
        message: string;
    }>;
}
