import 'dotenv/config';
import { MikroORM } from '@mikro-orm/core';
import databaseConfig from '../mikro-orm.config';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import authRoutes from './controllers/auth';
import ticketRoutes from './controllers/tickets';
import cors from 'cors';

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

MikroORM.init(databaseConfig).then(orm => {
  app.use((req, res, next) => {
    (req as any).em = orm.em.fork();
    next();
  });

  app.use('/auth', authRoutes);
  app.use('/tickets', ticketRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(console.error);