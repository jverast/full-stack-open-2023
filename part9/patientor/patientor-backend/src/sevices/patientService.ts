import patientEntries from '../../data/patientEntries';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
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

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = { id: uuid(), ...entry };

  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, getNonSensitivePatients, addPatient };
