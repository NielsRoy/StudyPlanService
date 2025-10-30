import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Career } from "./career.entity";
import { PlanSubject } from "./plan-subject.entity";

@Entity()
export class StudyPlan {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  code: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(
    () => Career,
    { nullable: false, onDelete: "CASCADE", eager: true }
  )
  career: Career;

  @OneToMany(() => PlanSubject, (planSubject) => planSubject.studyPlan, { eager: true })
  planSubjects: PlanSubject[];
}
