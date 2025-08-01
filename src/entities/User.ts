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
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ select: true })
  password!: string;

  @Column({ default: "user" }) 
  role!: "admin" | "courier" | "user";

  @Column({ default: false })
  isVerified!: boolean;

  @OneToMany(() => Package, (pkg) => pkg.user)
  packages!: Package[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
