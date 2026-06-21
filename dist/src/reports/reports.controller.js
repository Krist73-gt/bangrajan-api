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
import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Parser } from 'json2csv';
import { ReportsService } from './reports.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getAttendanceReport(month, year, res) {
        const data = await this.reportsService.getAttendanceReport(Number(month), Number(year));
        const fields = [
            'memberName',
            'memberId',
            'checkinDate',
            'checkinTime',
            'status',
            'sessionType',
            'remarks',
        ];
        const parser = new Parser({ fields });
        const csv = parser.parse(data);
        const filename = `attendance_${year}-${month.padStart(2, '0')}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
    async getMembersReport(status, res) {
        const data = await this.reportsService.getMembersReport(status);
        const fields = [
            'memberId',
            'fullName',
            'phone',
            'packageName',
            'packageCategory',
            'remainingSessions',
            'expiryDate',
            'status',
            'createdAt',
        ];
        const parser = new Parser({ fields });
        const csv = parser.parse(data);
        const filename = `members_${status || 'all'}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    }
};
__decorate([
    Get('attendance'),
    ApiOperation({ summary: 'Export attendance report as CSV (admin)' }),
    __param(0, Query('month')),
    __param(1, Query('year')),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getAttendanceReport", null);
__decorate([
    Get('members'),
    ApiOperation({ summary: 'Export members report as CSV (admin)' }),
    __param(0, Query('status')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getMembersReport", null);
ReportsController = __decorate([
    ApiTags('Reports'),
    Controller('api/reports'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    __metadata("design:paramtypes", [ReportsService])
], ReportsController);
export { ReportsController };
//# sourceMappingURL=reports.controller.js.map