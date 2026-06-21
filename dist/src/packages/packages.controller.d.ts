import { PackagesService } from './packages.service.js';
export declare class PackagesController {
    private readonly packagesService;
    constructor(packagesService: PackagesService);
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
    create(body: {
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
    update(id: number, body: Partial<{
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
    remove(id: number): Promise<{
        message: string;
    }>;
}
