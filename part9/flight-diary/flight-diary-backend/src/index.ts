import express from 'express';
import cors from 'cors';
import diaryRouter from './routes/diaries';

const app = express();
const PORT = 3000;

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
