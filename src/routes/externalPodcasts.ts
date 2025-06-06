import express, { Request, Response } from 'express';

const router = express.Router();
const LISTEN_NOTES_API_KEY = process.env.LISTEN_NOTES_API_KEY!;

// GET /api/external-podcasts?q=palavra-chave
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { q } = req.query;

  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'Parâmetro de busca "q" é obrigatório' });
    return
  }

  try {
    const externalRes = await fetch(`https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(q)}&type=episode`, {
      headers: {
        'X-ListenAPI-Key': LISTEN_NOTES_API_KEY,
      },
    });

    const data = await externalRes.json();

    const episodes = data.results.map((ep: any) => ({
      id: ep.id,
      title: ep.title_original,
      description: ep.description_original,
      audio: ep.audio,
      image: ep.image,
      podcastTitle: ep.podcast.title_original,
    }));

    res.json({ episodes });
  } catch (err) {
    console.error('Erro ao buscar episódios externos:', err);
    res.status(500).json({ error: 'Erro ao buscar episódios externos' });
  }
});

export default router;
