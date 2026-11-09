import express from 'express';
import { apiRouter } from './api.ts';
import { seedInitialData } from '../db/seed.ts';

export const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount the API Router at /api
app.use('/api', apiRouter);

// Ensure seed data is populated
seedInitialData().catch((err) => {
  console.warn('Initial seed check notice:', err.message);
});
