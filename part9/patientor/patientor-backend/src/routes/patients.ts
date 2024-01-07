import { Router } from 'express';
import patientService from '../sevices/patientService';

const router = Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

export default router;
