import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Subject } from "./subject.entity";
import { Prerequisite } from "./prerequisite.entity";
import { StudyPlan } from "./study-plan.entity";

@Entity()
export class PlanSubject {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  credits: number;

  @Column({
    default: false,
  })
  isOptional: boolean;

  @Column()
  levelNumber: number;
  
  @ManyToOne(() => Subject, { nullable: false, onDelete: "CASCADE", eager: true })
  subject: Subject;

  @ManyToOne(
    () => StudyPlan, (studyPlan) => studyPlan.planSubjects,
    { nullable: false, onDelete: "CASCADE" }
  )
  studyPlan: StudyPlan;

  @OneToMany(() => Prerequisite, (prerequisite) => prerequisite.planSubject)
  prerequisites: Prerequisite[];
}