import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/env';
import { Career } from './entities/career.entity';
import { PlanSubject } from './entities/plan-subject.entity';
import { Prerequisite } from './entities/prerequisite.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { Subject } from './entities/subject.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlanSubjectService } from './services/plan-subject.service';
import { PrerequisiteService } from './services/prerequisite.service';
import { StudyPlanService } from './services/study-plan.service';

const NATS_SERVICE = 'NATS_SERVICE';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ssl: envs.state === 'production',
      extra: {
        ssl: envs.state === 'production'
          ? { rejectUnauthorized: false }
          : false
      },
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
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
          servers: [`nats://${envs.natsHost}:${envs.natsPort}`],
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [PlanSubjectService, PrerequisiteService, StudyPlanService],
})
export class AppModule { }
