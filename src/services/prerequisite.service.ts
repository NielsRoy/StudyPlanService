import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prerequisite } from '../entities/prerequisite.entity';
import { PrerequisiteResponseDto } from '../dto/responses/prerequisite.response.dto';

@Injectable()
export class PrerequisiteService {

    constructor(
        @InjectRepository(Prerequisite)
        private readonly prerequisiteRepository: Repository<Prerequisite>,
    ) { }

    /**
     * Get all prerequisites for a list of plan subject IDs
     * @param planSubjectIds - Array of plan subject IDs
     * @returns Array of prerequisites mapping plan subjects to their required prerequisites
     */
    async getPrerequisitesByPlanSubjectIds(planSubjectIds: number[]): Promise<PrerequisiteResponseDto[]> {
        if (planSubjectIds.length === 0) {
            return [];
        }

        const results = await this.prerequisiteRepository.createQueryBuilder("prerequisite")
            .innerJoin("prerequisite.planSubject", "planSubject")
            .innerJoin("prerequisite.prerequisitePlanSubject", "prerequisitePlanSubject")
            .select([
                `planSubject.id AS "planSubjectId"`,
                `prerequisitePlanSubject.id AS "prerequisitePlanSubjectId"`
            ])
            .where("planSubject.id IN (:...ids)", { ids: planSubjectIds })
            .getRawMany<PrerequisiteResponseDto>();

        return results;
    }
}
