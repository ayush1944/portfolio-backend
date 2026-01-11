import express from 'express';
import cors from 'cors';
import contactRoutes from './routes/contact.routes.js';

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

app.use('/api/contact', contactRoutes);

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

export default app;
