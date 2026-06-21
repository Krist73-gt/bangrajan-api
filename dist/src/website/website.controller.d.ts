import { WebsiteService } from './website.service.js';
export declare class WebsiteController {
    private readonly websiteService;
    constructor(websiteService: WebsiteService);
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
    updateSchedules(body: Array<{
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
    addGalleryImage(body: {
        title: string;
        sortOrder?: string;
    }, file: Express.Multer.File): Promise<{
        id: number;
        createdAt: Date;
        isActive: boolean;
        sortOrder: number;
        title: string;
        imageUrl: string;
    }>;
    updateGalleryImage(id: number, body: Partial<{
        title: string;
        sortOrder: string;
    }>, file?: Express.Multer.File): Promise<{
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
