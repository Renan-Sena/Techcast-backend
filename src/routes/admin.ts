import express, { Request, Response, NextFunction } from 'express';
import authenticate from '../middlewares/auth';
import { PrismaClient } from '../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Acesso negado: apenanps administradores' });
    return;
  }

  next();
};

// GET /api/admin/users
router.get('/users', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// GET /api/admin/episodes
router.get('/episodes', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const episodes = await prisma.episode.findMany();
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar episódios' });
  }
});

// POST /api/admin/episodes
router.post('/episodes', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Título é obrigatório' });
    return;
  }

  try {
    const newEpisode = await prisma.episode.create({
      data: {
        title,
        description,
      },
    });

    res.status(201).json(newEpisode);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar episódio' });
  }
});

// POST /api/admin/users/:id/promote
router.post('/users/:id/promote', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' },
    });

    res.json({ message: 'Usuário promovido a admin', user });
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
});

export default router;
