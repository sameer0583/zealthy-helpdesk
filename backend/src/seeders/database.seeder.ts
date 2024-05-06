import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../entities/User';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if the 'user' table is empty
    const userCount = await em.count(User);
    if (userCount === 0) {
      const users = this.getUsers(em);
      em.persist(Object.values(users));
    } else {
      console.log('Database already seeded');
    }
  }

  private getUsers(em: EntityManager): Record<string, User> {
    return {
      sameer: em.create(User, {
        name: 'Sameer',
        email: 'sameer.tanakia@gmail.com',
        password: 'password123',
      }),
      kyle: em.create(User, {
        name: 'Kyle',
        email: 'kyle@getzealthy.com',
        password: 'password123',
      }),
      brie: em.create(User, {
        name: 'Brie',
        email: 'brie@getzealthy.com',
        password: 'password123',
      }),
      shanti: em.create(User, {
        name: 'Shanti',
        email: 'shantibraford@gmail.com',
        password: 'password123',
      })
    };
  }
}
