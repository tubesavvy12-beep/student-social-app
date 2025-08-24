import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import usersRouter from './routes/users.js';
import tweetsRouter from './routes/tweets.js';
import premiumRouter from './routes/premium.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'student-social-server' });
});

app.use('/api/users', usersRouter);
app.use('/api/tweets', tweetsRouter);
app.use('/api/premium', premiumRouter);

export default app;