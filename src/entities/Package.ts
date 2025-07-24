import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { SmartBox } from './SmartBox';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  receiver!: string;

  @Column()
  content!: string;

  @Column()
  qrCode!: string;


  @Column({ default: false })
  isPickedUp!: boolean;

  @ManyToOne(() => User, (user) => user.packages)
  user!: User;

  @ManyToOne(() => SmartBox, (smartbox) => smartbox.packages)
  smartBox!: SmartBox;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
