import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Report } from './report.entity';

@Entity({ name: 'log' })
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  reportId: string;

  @ManyToOne(() => Report, (report) => report.history)
  report: Report;

  @Column({ nullable: false })
  timestamp: Date;

  @Column({ nullable: false })
  status: string;

  @Column({ nullable: false })
  responseTime: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
