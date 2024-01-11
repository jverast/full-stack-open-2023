import patientEntries from '../../data/patientEntries';
import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  Entry,
  NewEntry
} from '../types';
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

const addPatient = (patientFormValues: NewPatient): Patient => {
  const id = uuid();
  const entries: Entry[] = [];

  const newPatient = { ...patientFormValues, entries, id };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entryFormValues: NewEntry, id: string): Entry => {
  const patientToAddEntry = patients.find((p) => p.id === id);
  if (!patientToAddEntry) {
    throw new Error('Patient was not found');
  }

  const entryId = uuid();
  const newEntry = { ...entryFormValues, id: entryId };
  patientToAddEntry.entries = patientToAddEntry.entries.concat(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry
};
