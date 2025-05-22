import express, { Request, Response } from 'express';
import authenticate from '../middlewares/auth';
import { PrismaClient } from '../generated/prisma';
import { upload } from '../middlewares/upload'; // middleware Multer configurado para salvar arquivos

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/episodes - listar todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const episodes = await prisma.episode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(episodes);
  } catch (err) {
    console.error('Erro ao buscar episódios:', err);
    res.status(500).json({ error: 'Erro ao buscar episódios' });
  }
});

// GET /api/episodes/:id - detalhes
router.get('/:id', async (req: Request, res: Response) => {
  const episodeId = parseInt(req.params.id);
  try {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });
    if (!episode) {
      res.status(404).json({ error: 'Episódio não encontrado' });
      return;
    }
    res.json(episode);
  } catch (err) {
    console.error('Erro ao buscar episódio:', err);
    res.status(500).json({ error: 'Erro ao buscar episódio' });
  }
});

// POST /api/episodes - criar episódio (com upload de arquivos)
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  async (req: Request, res: Response) : Promise<void> => {
    try {
      const { title, description } = req.body;
      if (!title || title.trim() === '') {
        res.status(400).json({ error: 'Título é obrigatório' });
        return
      }

      // Valida se recebeu os arquivos
      if (!req.files || !('image' in req.files) || !('audio' in req.files)) {
        res.status(400).json({ error: 'Imagem e arquivo de áudio são obrigatórios' });
        return
      }

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files.image[0];
      const audioFile = files.audio[0];

      const newEpisode = await prisma.episode.create({
        data: {
          title,
          description,
          imageUrl: `/uploads/${imageFile.filename}`,
          audioUrl: `/uploads/${audioFile.filename}`,
        },
      });

      res.status(201).json(newEpisode);
    } catch (err) {
      console.error('Erro ao criar episódio:', err);
      res.status(500).json({ error: 'Erro ao criar episódio' });
    }
  } 
);

// PUT /api/episodes/:id - atualizar episódio (com possibilidade de atualizar arquivos)
router.put(
  '/:id',
  authenticate,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    const episodeId = parseInt(req.params.id);
    const { title, description } = req.body;

    if (title && title.trim() === '') {
      res.status(400).json({ error: 'Título não pode ser vazio' });
      return
    }

    try {
      const dataToUpdate: any = {
        description,
      };
      if (title) dataToUpdate.title = title;

      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.image && files.image.length > 0) {
          dataToUpdate.imageUrl = `/uploads/${files.image[0].filename}`;
        }
        if (files.audio && files.audio.length > 0) {
          dataToUpdate.audioUrl = `/uploads/${files.audio[0].filename}`;
        }
      }

      const updatedEpisode = await prisma.episode.update({
        where: { id: episodeId },
        data: dataToUpdate,
      });

      res.json(updatedEpisode);
    } catch (err) {
      console.error('Erro ao atualizar episódio:', err);
      res.status(500).json({ error: 'Erro ao atualizar episódio' });
    }
  }
);

// DELETE /api/episodes/:id - deletar episódio
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  const episodeId = parseInt(req.params.id);

  try {
    await prisma.episode.delete({
      where: { id: episodeId },
    });
    res.json({ message: 'Episódio deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar episódio:', err);
    res.status(500).json({ error: 'Erro ao deletar episódio' });
  }
});

export default router;
