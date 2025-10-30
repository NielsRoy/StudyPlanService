import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlanSubjectResponseDto } from './dto/responses/plan-subject.response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_plan_subjects_by_id_list')
  getPlanSubjectsByIdList(@Payload() planSubjectIds: number[]) {
    return this.appService.getPlanSubjectsByIdList(planSubjectIds);
  }
}
