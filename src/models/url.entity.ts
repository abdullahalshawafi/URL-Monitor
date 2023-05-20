import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Report } from './report.entity';

@Entity({ name: 'url' })
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.urls)
  user: User;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  protocol: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  port?: number;

  @Column({ nullable: true })
  webhook?: string;

  @Column({ type: 'float', default: 5, nullable: false })
  timeout: number;

  @Column({ type: 'float', default: 600, nullable: false })
  interval: number;

  @Column({ default: 1, nullable: false })
  threshold: number;

  @Column({ type: 'json', nullable: true })
  authentication?: Record<string, string>;

  @Column('json', { nullable: true })
  httpHeaders?: Record<string, string>;

  @Column('json', { nullable: true })
  assert?: Record<string, any>;

  @Column('json', { nullable: true })
  tags?: string[];

  @Column({ nullable: false })
  ignoreSSL: boolean;

  @OneToOne(() => Report, (report) => report.url)
  report: Report;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
