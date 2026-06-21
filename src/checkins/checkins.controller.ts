import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckinsService } from './checkins.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';

@ApiTags('Check-in')
@Controller('api/checkins')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Process check-in via barcode/member ID' })
  scan(@Body() body: { memberId: string }, @CurrentUser() user: AuthUser) {
    return this.checkinsService.processScan(body.memberId, user.id);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today check-ins' })
  getToday() {
    return this.checkinsService.getToday();
  }

  @Get()
  @ApiOperation({ summary: 'List all check-ins (filter date range, paginate)' })
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.checkinsService.findAll({
      startDate,
      endDate,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }
}
