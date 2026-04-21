import express from 'express';
import cors from 'cors';
import contactRoutes from './routes/contact.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://ayushpal.me',
  'https://www.ayushpal.me',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json());

app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

export default app;
