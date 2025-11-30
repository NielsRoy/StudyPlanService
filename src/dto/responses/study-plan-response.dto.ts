import { SubjectWithPrerequisitesDto } from './subject-with-prerequisites.dto';

export class StudyPlanResponseDto {
    studyPlanId: number;
    code: string;
    career: string;
    subjects: SubjectWithPrerequisitesDto[];
}
