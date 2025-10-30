import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subject {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  code: string;

  @Column()
  name: string;
}