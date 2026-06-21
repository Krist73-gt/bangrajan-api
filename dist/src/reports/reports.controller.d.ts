import type { Response } from 'express';
import { ReportsService } from './reports.service.js';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getAttendanceReport(month: string, year: string, res: Response): Promise<void>;
    getMembersReport(status: string, res: Response): Promise<void>;
}
