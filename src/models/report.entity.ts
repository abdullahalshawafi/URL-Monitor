import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Url } from './url.entity';
import { Log } from './log.entity';

@Entity({ name: 'report' })
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Url, (url) => url.report)
  @JoinColumn()
  url: Url;

  @Column({ default: false, nullable: false })
  isUp: boolean;

  @Column({ default: 0, nullable: false })
  totalRequests: number;

  @Column({ type: 'float', default: 0, nullable: false })
  availability: number;

  @Column({ default: 0, nullable: false })
  outages: number;

  @Column({ type: 'float', default: 0, nullable: false })
  downtime: number;

  @Column({ type: 'float', default: 0, nullable: false })
  uptime: number;

  @Column({ type: 'float', default: 0, nullable: false })
  responseTime: number;

  @Column({ default: 0, nullable: false })
  downCount: number;

  @OneToMany(() => Log, (log) => log.report)
  history: Log[];

  @Column({ default: false, nullable: false })
  notified: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
