import { Entity, PrimaryKey, Property, Collection, OneToMany } from '@mikro-orm/core';
import { Response } from './Response';

@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @OneToMany(() => Response, response => response.user)
  responses = new Collection<Response>(this);

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}