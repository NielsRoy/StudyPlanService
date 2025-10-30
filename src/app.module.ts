import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/env';
import { Career } from './entities/career.entity';
import { PlanSubject } from './entities/plan-subject.entity';
import { Prerequisite } from './entities/prerequisite.entity';
import { StudyPlan } from './entities/study-plan.entity';
import { Subject } from './entities/subject.entity';

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
      // entities: [
      //   Career,
      //   Subject,
      //   StudyPlan,
      //   PlanSubject,
      //   Prerequisite,
      // ],
    }),
    TypeOrmModule.forFeature([
      Career,
      Subject,
      StudyPlan,
      PlanSubject,
      Prerequisite,
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
