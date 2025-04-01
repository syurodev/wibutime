import { Column, Entity, Index } from 'typeorm';
import { TypeOrmBaseEntity } from './base.entity';

@Entity({ name: 'user_devices' })
export class UserDevice extends TypeOrmBaseEntity {
  @Index()
  @Column({ name: 'user_id' })
  user_id: number;

  @Index()
  @Column({ type: 'varchar', name: 'device_id', length: 255, nullable: false })
  device_id: string;

  @Column({
    type: 'varchar',
    name: 'device_name',
    length: 100,
    nullable: false,
  })
  device_name: string;

  @Column({ type: 'varchar', name: 'device_type', length: 50, nullable: false })
  device_type: string;

  @Column({ type: 'varchar', name: 'device_os', length: 50, nullable: true })
  device_os: string;

  @Column({
    type: 'varchar',
    name: 'browser_info',
    length: 255,
    nullable: true,
  })
  browser_info: string;

  @Column({ type: 'varchar', name: 'ip_address', length: 50, nullable: true })
  ip_address: string;

  @Column({ type: 'varchar', length: 1000, nullable: false })
  token: string;

  @Column({ type: 'timestamp', name: 'last_login_at', nullable: true })
  last_login_at: Date;

  @Column({ type: 'smallint', name: 'is_active', default: 1 })
  is_active: number;

  @Column({ type: 'smallint', name: 'is_trusted', default: 0 })
  is_trusted: number;
}
