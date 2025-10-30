import { Check, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { PlanSubject } from "./plan-subject.entity";

@Entity()
@Unique(["planSubject", "prerequisitePlanSubject"])
@Check(`"planSubjectId" <> "prerequisitePlanSubjectId"`)
export class Prerequisite {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PlanSubject, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "planSubjectId" })
  planSubject: PlanSubject;

  @ManyToOne(() => PlanSubject, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "prerequisitePlanSubjectId" })
  prerequisitePlanSubject: PlanSubject;
}