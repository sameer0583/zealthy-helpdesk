import { Entity, PrimaryKey, Property, ManyToOne, Collection, OneToMany } from '@mikro-orm/core';
import { Response } from './Response';

@Entity()
export class Ticket {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  description!: string;

  @Property()
  status: 'new' | 'in_progress' | 'resolved' = 'new';

  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Response, response => response.ticket)
  responses = new Collection<Response>(this);

  constructor(name: string, email: string, description: string) {
    this.name = name;
    this.email = email;
    this.description = description;
  }
}