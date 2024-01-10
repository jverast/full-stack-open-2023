import patientEntries from '../../data/patientEntries';
import { Patient, NonSensitivePatient, NewPatient, Entry } from '../types';
import { v4 as uuid } from 'uuid';

const patients = patientEntries;

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatient = (id: string): Patient => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) {
    throw new Error('Patient was not found');
  }
  return patient;
};

const addPatient = (entry: NewPatient): Patient => {
  const id = uuid();
  const entries: Entry[] = [];

  const newPatient = { ...entry, entries, id };

  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, getNonSensitivePatients, addPatient, getPatient };
