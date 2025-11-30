import { PrerequisiteInfoDto } from './prerequisite-info.dto';

export class SubjectWithPrerequisitesDto {
    code: string;
    name: string;
    level: number;
    credits: number;
    isOptional: boolean;
    prerequisites: PrerequisiteInfoDto[];
}
