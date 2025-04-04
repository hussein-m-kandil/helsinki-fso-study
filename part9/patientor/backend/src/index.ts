import express from 'express';

const PORT = 3001;

const app = express();

app.use(express.json());
app.use((req, _res, next) => {
  console.log(
    `${req.method}: ${req.originalUrl}, Body: ${JSON.stringify(req.body, null, 2)}`,
  );
  next();
});

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
