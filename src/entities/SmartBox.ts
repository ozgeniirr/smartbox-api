import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from './Package';

@Entity()
export class SmartBox {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  location!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 0 })
  capacity!: number;

  @OneToMany(() => Package, (pkg) => pkg.smartBox)
  packages!: Package[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
