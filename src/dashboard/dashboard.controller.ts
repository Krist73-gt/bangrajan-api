import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { MembersService } from '../members/members.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';

@ApiTags('Dashboard')
@Controller('api/dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly membersService: MembersService
  ) {}

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

  @Get('member/activity')
  @Roles('member')
  @ApiOperation({ summary: 'Get member activity history' })
  async getMemberActivity(@CurrentUser() user: AuthUser) {
    // get member profile ID first
    const stats = await this.dashboardService.getMemberStats(user.id);
    if (!stats) return [];
    return this.membersService.getActivityHistory(stats.id);
  }
}
