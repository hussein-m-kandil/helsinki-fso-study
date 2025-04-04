import { NewPatient, PublicPatient } from '../types';
import { Router, Response, Request, NextFunction } from 'express';
import { NewEntrySchema, NewPatientSchema } from '../utils';
import patientService from '../services/patientService';

const patientRouter = Router();

patientRouter.get('/', (_req, res: Response<PublicPatient[]>) => {
  res.json(patientService.getAllPatients());
});

patientRouter.get('/:id', (req, res) => {
  const patient = patientService.findOnePatientById(req.params.id);
  if (patient) res.json(patient);
  else res.status(404).json({ error: { message: 'patient not found' } });
});

patientRouter.post(
  '/',
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = NewPatientSchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  },
  (req: Request<unknown, unknown, NewPatient>, res: Response) => {
    res.json(patientService.addOnePatient(req.body));
  },
);

patientRouter.post('/:id/entries', (req, res, next) => {
  try {
    const newEntry = NewEntrySchema.parse(req.body);
    res.json(patientService.addEntry(req.params.id, newEntry));
  } catch (error) {
    next(error);
  }
});

export default patientRouter;
