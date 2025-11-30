import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanSubject } from '../entities/plan-subject.entity';
import { PlanSubjectResponseDto } from '../dto/responses/plan-subject.response.dto';

@Injectable()
export class PlanSubjectService {

    constructor(
        @InjectRepository(PlanSubject)
        private readonly planSubjectRepository: Repository<PlanSubject>,
    ) { }

    /**
     * Get all plan subjects for a specific study plan
     * @param studyPlanId - The ID of the study plan
     * @returns Array of plan subjects with subject details
     */
    async getPlanSubjectsByStudyPlanId(studyPlanId: number): Promise<PlanSubjectResponseDto[]> {
        const results = await this.planSubjectRepository.createQueryBuilder("planSubject")
            .innerJoin("planSubject.subject", "subject")
            .select([
                "subject.code AS code",
                "subject.name AS name",
                `planSubject.id AS "planSubjectId"`,
                "planSubject.credits AS credits",
                `planSubject.levelNumber AS level`
            ])
            .where("planSubject.studyPlan.id = :studyPlanId", { studyPlanId })
            .getRawMany<PlanSubjectResponseDto>();

        return results;
    }
}
