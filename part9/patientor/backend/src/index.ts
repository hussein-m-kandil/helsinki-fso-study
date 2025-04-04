import { ZodError } from 'zod';
import { AppError, isNumber } from './utils';
import express, { NextFunction, Request, Response } from 'express';
import diagnosisRouter from './routes/diagnosis';
import patientRouter from './routes/patient';
import path from 'node:path';

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = path.join(__dirname, '../public');

const app = express();

app.use(express.static(PUBLIC_DIR));
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

app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);

app.use((req, res, next) => {
  // Forward any GET request to the client-side routing
  if (req.method === 'GET') {
    res.sendFile(`${PUBLIC_DIR}/index.html`);
  } else next();
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const toJsonError = (e: Error) => ({ error: { message: e.message } });
  if (error instanceof ZodError) {
    res.status(400).json({ error: error.issues[0] });
  } else if (error instanceof AppError) {
    res.status(error.statusCode).json(toJsonError(error));
  } else if (error instanceof Error) {
    let statusCode;
    if ('statusCode' in error) statusCode = error.statusCode;
    else if ('status' in error) statusCode = error.status;
    if (isNumber(statusCode)) {
      res.status(statusCode).json(toJsonError(error));
    } else {
      res.status(500).json(toJsonError(new Error('something went wrong')));
    }
  }
});

if (!process.env.SERVERLESS_FUNCTION) {
  app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
}

export default app;
