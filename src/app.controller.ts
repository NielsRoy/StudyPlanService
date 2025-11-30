import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlanSubjectResponseDto } from './dto/responses/plan-subject.response.dto';
import { PlanSubjectService } from './services/plan-subject.service';
import { PrerequisiteService } from './services/prerequisite.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly planSubjectService: PlanSubjectService,
    private readonly prerequisiteService: PrerequisiteService,
  ) { }

  @MessagePattern('get_plan_subjects_by_id_list')
  getPlanSubjectsByIdList(@Payload() planSubjectIds: number[]) {
    return this.appService.getPlanSubjectsByIdList(planSubjectIds);
  }

  @MessagePattern('get_plan_subjects_by_study_plan_id')
  getPlanSubjectsByStudyPlanId(@Payload('studyPlanId', ParseIntPipe) studyPlanId: number) {
    return this.planSubjectService.getPlanSubjectsByStudyPlanId(studyPlanId);
  }

  @MessagePattern('get_prerequisites_by_plan_subject_ids')
  getPrerequisitesByPlanSubjectIds(@Payload() planSubjectIds: number[]) {
    return this.prerequisiteService.getPrerequisitesByPlanSubjectIds(planSubjectIds);
  }
}
