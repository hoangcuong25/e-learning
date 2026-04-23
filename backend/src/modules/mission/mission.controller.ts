import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { MissionService } from './mission.service';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '../../core/decorator/customize';

@ApiBearerAuth()
@ApiTags('Mission')
@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('daily')
  @ResponseMessage('Get daily missions')
  @ApiOperation({ summary: 'Lấy danh sách nhiệm vụ hàng ngày của user' })
  getDailyMissions(@Req() req) {
    return this.missionService.getDailyMissions(req.user.id);
  }

  @Post('update-progress')
  @ResponseMessage('Update mission progress')
  @ApiOperation({ summary: 'Cập nhật tiến độ nhiệm vụ (thời gian online)' })
  updateProgress(
    @Req() req,
    @Body('minutes') minutes: number,
  ) {
    return this.missionService.updateProgress(req.user.id, minutes);
  }
}
