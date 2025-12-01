import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan } from '../entities/study-plan.entity';
import { StudyPlanResponseDto } from '../dto/responses/study-plan-response.dto';
import { SubjectWithPrerequisitesDto } from '../dto/responses/subject-with-prerequisites.dto';
import { PrerequisiteInfoDto } from '../dto/responses/prerequisite-info.dto';
import { PlanSubject } from '../entities/plan-subject.entity';

@Injectable()
export class StudyPlanService {

    constructor(
        @InjectRepository(StudyPlan)
        private readonly studyPlanRepository: Repository<StudyPlan>,
    ) { }

    /**
     * Get a complete study plan by ID with all subjects and prerequisites
     * @param studyPlanId - The ID of the study plan
     * @returns Complete study plan with subjects and prerequisites
     */
    async getStudyPlanById(studyPlanId: number): Promise<StudyPlanResponseDto> {
        try {
            const studyPlan = await this.studyPlanRepository.findOne({
                where: { id: studyPlanId },
                relations: ['career', 'planSubjects', 'planSubjects.subject', 'planSubjects.prerequisites', 'planSubjects.prerequisites.prerequisitePlanSubject', 'planSubjects.prerequisites.prerequisitePlanSubject.subject'],
            });

            if (!studyPlan) {
                throw new NotFoundException(`Study plan with ID ${studyPlanId} not found`);
            }

            return this.buildStudyPlanResponse(studyPlan);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to get study plan: ${error.message}`);
        }
    }

    /**
     * Build the complete study plan response DTO
     * @param studyPlan - The study plan entity with all relations loaded
     * @returns Formatted study plan response
     */
    private buildStudyPlanResponse(studyPlan: StudyPlan): StudyPlanResponseDto {
        return {
            studyPlanId: studyPlan.id,
            code: studyPlan.code,
            career: studyPlan.career.name,
            subjects: this.mapSubjectsWithPrerequisites(studyPlan.planSubjects),
        };
    }

    /**
     * Map plan subjects to include their prerequisites
     * @param planSubjects - Array of plan subjects with prerequisites loaded
     * @returns Array of subjects with their prerequisites
     */
    private mapSubjectsWithPrerequisites(planSubjects: PlanSubject[]): SubjectWithPrerequisitesDto[] {
        return planSubjects.map(planSubject => ({
            code: planSubject.subject.code,
            name: planSubject.subject.name,
            level: planSubject.levelNumber,
            credits: planSubject.credits,
            isOptional: planSubject.isOptional,
            prerequisites: this.mapPrerequisites(planSubject),
        }));
    }

    /**
     * Map prerequisites for a plan subject
     * @param planSubject - The plan subject with prerequisites loaded
     * @returns Array of prerequisite information
     */
    private mapPrerequisites(planSubject: PlanSubject): PrerequisiteInfoDto[] {
        if (!planSubject.prerequisites || planSubject.prerequisites.length === 0) {
            return [];
        }

        return planSubject.prerequisites.map(prerequisite => ({
            code: prerequisite.prerequisitePlanSubject.subject.code,
            name: prerequisite.prerequisitePlanSubject.subject.name,
        }));
    }

    /**
     * Get only the career name for a study plan (lightweight query)
     * @param studyPlanId - The ID of the study plan
     * @returns Career name
     */
    async getCareerNameByStudyPlanId(studyPlanId: number): Promise<string> {
        try {
            const studyPlan = await this.studyPlanRepository.findOne({
                where: { id: studyPlanId },
                relations: ['career'],
            });

            if (!studyPlan) {
                throw new NotFoundException(`Study plan with ID ${studyPlanId} not found`);
            }

            return studyPlan.career.name;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to get career name: ${error.message}`);
        }
    }
}
