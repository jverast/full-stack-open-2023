import patientEntries from '../../data/patientEntries';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
import { v4 as uuid } from 'uuid';

const getEntries = (): Patient[] => {
  return patientEntries;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patientEntries.map(
    ({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
    })
  );
};

const addEntry = (entry: NewPatient): Patient => {
  const newPatient = { id: uuid(), ...entry };

  patientEntries.push(newPatient);
  return newPatient;
};

export default { getEntries, getNonSensitiveEntries, addEntry };
