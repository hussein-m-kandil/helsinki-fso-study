import { Router, Response } from 'express';
import { Diagnosis } from '../types';
import diagnosisService from '../services/diagnosisService';

const diagnosisRouter = Router();

diagnosisRouter.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnosisService.getAllDiagnoses());
});

export default diagnosisRouter;
