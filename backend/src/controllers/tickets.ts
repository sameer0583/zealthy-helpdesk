import { Router, Request, Response } from 'express';
import { Ticket } from '../entities/Ticket';
import { User } from '../entities/User';
import { Response as TicketResponse } from '../entities/Response';
import { EntityManager } from '@mikro-orm/mysql';
import { wrap } from '@mikro-orm/core';

const router = Router();

interface CustomRequest extends Request {
  em: EntityManager;
}

// Create a new ticket
router.post('/', async (req: CustomRequest, res: Response) => {
  const { name, email, description } = req.body;
  const ticket = new Ticket(name, email, description);
  await req.em.persistAndFlush(ticket);
  res.status(201).send(ticket);
});

// Get all tickets sorted by recency
router.get('/', async (req: CustomRequest, res: Response) => {
  try {
    const tickets = await req.em.find(Ticket, {}, {
      populate: ['responses', 'responses.user'],
      orderBy: { status: 'DESC', updatedAt: 'DESC' },
    });
    return res.status(200).json(tickets);
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching tickets', error: e.message });
  }
});

// Get a single ticket by ID including responses
router.get('/:id', async (req: CustomRequest, res: Response) => {
  try {
    const ticket = await req.em.findOne(Ticket, { id: parseInt(req.params.id) }, { 
      populate: ['responses', 'responses.user'],
    });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json(ticket);
  } catch (e) {
    return res.status(500).json({ message: 'Error fetching ticket', error: e.message });
  }
});

// Update a ticket's status
router.patch('/:id/status', async (req: CustomRequest, res: Response) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Missing status' });
  }

  try {
    const ticket = await req.em.findOne(Ticket, { id: parseInt(req.params.id) });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    ticket.status = status;
    await req.em.persistAndFlush(ticket);
    return res.status(200).json(ticket);
  } catch (e) {
    return res.status(500).json({ message: 'Error updating ticket', error: e.message });
  }
});

// Add a response to a ticket
router.post('/:id/responses', async (req: CustomRequest, res: Response) => {
  const { description } = req.body;
  const { userId } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Description must be provided.' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID must be provided.' });
  }

  try {
    const ticket = await req.em.findOne(Ticket, { id: parseInt(req.params.id) });
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const user = await req.em.findOne(User, { id: parseInt(userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const response = new TicketResponse(description, ticket, user);
    await req.em.persistAndFlush(response);

    ticket.updatedAt = new Date();
    await req.em.persistAndFlush(ticket);

    const updatedTicket = await req.em.findOne(Ticket, { id: parseInt(req.params.id) }, { 
      populate: ['responses', 'responses.user'],
    });

    return res.status(201).json(updatedTicket);
  } catch (e) {
    return res.status(500).json({ message: 'Error adding response to ticket', error: e.message });
  }
});

export default router;