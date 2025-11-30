import { Controller, Get, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlanSubjectService } from './services/plan-subject.service';
import { PrerequisiteService } from './services/prerequisite.service';
import { StudyPlanService } from './services/study-plan.service';

@Controller()
export class AppController {
  constructor(
    private readonly planSubjectService: PlanSubjectService,
    private readonly prerequisiteService: PrerequisiteService,
    private readonly studyPlanService: StudyPlanService,
  ) { }

  @MessagePattern('get_study_plan')
  getStudyPlan(@Payload('studyPlanId', ParseIntPipe) studyPlanId: number) {
    return this.studyPlanService.getStudyPlanById(studyPlanId);
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
