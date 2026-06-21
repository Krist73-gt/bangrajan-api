import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { Parser } from 'json2csv';
import { ReportsService } from './reports.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Reports')
@Controller('api/reports')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('attendance')
  @ApiOperation({ summary: 'Export attendance report as CSV (admin)' })
  async getAttendanceReport(
    @Query('month') month: string,
    @Query('year') year: string,
    @Res() res: Response,
  ) {
    const data = await this.reportsService.getAttendanceReport(
      Number(month),
      Number(year),
    );

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

  @Get('members')
  @ApiOperation({ summary: 'Export members report as CSV (admin)' })
  async getMembersReport(
    @Query('status') status: string,
    @Res() res: Response,
  ) {
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
}
