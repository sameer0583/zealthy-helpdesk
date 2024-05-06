import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Ticket } from './Ticket';
import { User } from './User';

@Entity()
export class Response {

  @PrimaryKey()
  id!: number;

  @Property()
  description!: string;

  @ManyToOne(() => Ticket)
  ticket!: Ticket;

  @ManyToOne(() => User)
  user!: User;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  constructor(description: string, ticket: Ticket, user: User) {
    this.description = description;
    this.ticket = ticket;
    this.user = user;
  }
}