import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import episodesRoutes from './routes/episodes';
import accountRoutes from './routes/account';
import adminRoutes from './routes/admin';

dotenv.config({ path: './.env' });

const app = express();

console.log('JWT_SECRET carregado:', process.env.JWT_SECRET);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/episodes', episodesRoutes);
app.use('/api', accountRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API TechCast no ar!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
