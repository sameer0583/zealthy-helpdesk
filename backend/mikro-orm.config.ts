import { LoadStrategy } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { User } from './src/entities/User';
import { Ticket } from './src/entities/Ticket';
import { Response } from './src/entities/Response';
import { InitialMigration } from './src/migrations/InitialMigration';
import { join } from 'path';

export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'zealthy',
  password: process.env.DB_PASS || 'password123',
  dbName: process.env.DB_NAME || 'zealthy_help_desk',
  migrations: {
    migrationsList: [
      {
        name: 'InitialMigration',
        class: InitialMigration,
      },
    ],
  },
  entities: [User, Ticket, Response],
  discovery: { disableDynamicFileAccess: true },
  seeder: {
    pathTs: join(__dirname, 'src', 'seeders'),
  },
  debug: true,
  loadStrategy: LoadStrategy.JOINED,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  // registerRequestContext: false,
  extensions: [Migrator, EntityGenerator, SeedManager],
});
