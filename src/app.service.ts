import { Injectable } from '@nestjs/common';
import { PlanSubject } from './entities/plan-subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanSubjectResponseDto } from './dto/responses/plan-subject.response.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(PlanSubject)
    private readonly planSubjectRepository: Repository<PlanSubject>,
  ) {}

  async getPlanSubjectsByIdList(planSubjectIds: number[]): Promise<PlanSubjectResponseDto[]> {
    if (planSubjectIds.length === 0) {
      return [];
    }

    const results = await this.planSubjectRepository.createQueryBuilder("planSubject")
      .innerJoin("planSubject.subject", "subject")
      .select([
        "subject.code AS code",
        "subject.name AS name",
        `planSubject.id AS "planSubjectId"`,
        "planSubject.credits AS credits",
        "planSubject.levelNumber AS level"
      ])
      .where("planSubject.id IN (:...ids)", { ids: planSubjectIds })
      .getRawMany<PlanSubjectResponseDto>();
    return results;
  }
}
