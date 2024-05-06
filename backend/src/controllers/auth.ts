import { Router, Request, Response } from 'express';
import { User } from '../entities/User';
import { EntityManager } from '@mikro-orm/mysql';

const router = Router();

interface CustomRequest extends Request {
  em: EntityManager;
}

// Login user
router.post('/login', async (req: CustomRequest, res: Response) => {
  const { email, password } = req.body;
  const user = await req.em.findOne(User, { email });

  if (!user || password != user.password) {
    return res.status(400).send({ message: 'Invalid credentials' });
  }

  res.send(user);
});

export default router;