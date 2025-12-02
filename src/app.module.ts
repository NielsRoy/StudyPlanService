import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from './config/env';
import { Career } from './entities/career.entity';
import { PlanSubject } from './entities/plan-subject.entity';
import { Prerequisite } from './entities/prerequisite.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { Subject } from './entities/subject.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlanSubjectService } from './services/plan-subject.service';
import { PrerequisiteService } from './services/prerequisite.service';
import { StudyPlanService } from './services/study-plan.service';
import { HealthController } from './health.controller';

const NATS_SERVICE = 'NATS_SERVICE';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ssl: env.STATE === 'production',
      extra: {
        ssl: env.STATE === 'production'
          ? { rejectUnauthorized: false }
          : false
      },
      type: 'postgres',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([
      Career,
      Subject,
      StudyPlan,
      PlanSubject,
      Prerequisite,
    ]),
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [env.NATS_SERVER_URL],
        }
      },
    ]),
  ],
  controllers: [AppController, HealthController],
  providers: [PlanSubjectService, PrerequisiteService, StudyPlanService],
})
export class AppModule { }
