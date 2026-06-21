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
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckinsService } from './checkins.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let CheckinsController = class CheckinsController {
    checkinsService;
    constructor(checkinsService) {
        this.checkinsService = checkinsService;
    }
    scan(body, user) {
        return this.checkinsService.processScan(body.memberId, user.id);
    }
    getToday() {
        return this.checkinsService.getToday();
    }
    findAll(startDate, endDate, page, limit) {
        return this.checkinsService.findAll({
            startDate,
            endDate,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
};
__decorate([
    Post('scan'),
    ApiOperation({ summary: 'Process check-in via barcode/member ID' }),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CheckinsController.prototype, "scan", null);
__decorate([
    Get('today'),
    ApiOperation({ summary: 'Get today check-ins' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CheckinsController.prototype, "getToday", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'List all check-ins (filter date range, paginate)' }),
    __param(0, Query('startDate')),
    __param(1, Query('endDate')),
    __param(2, Query('page')),
    __param(3, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CheckinsController.prototype, "findAll", null);
CheckinsController = __decorate([
    ApiTags('Check-in'),
    Controller('api/checkins'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    __metadata("design:paramtypes", [CheckinsService])
], CheckinsController);
export { CheckinsController };
//# sourceMappingURL=checkins.controller.js.map