import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';

@ApiTags('Dashboard')
@Controller('api/dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin/stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Get('member/stats')
  @Roles('member')
  @ApiOperation({ summary: 'Get member dashboard stats' })
  getMemberStats(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getMemberStats(user.id);
  }
}
