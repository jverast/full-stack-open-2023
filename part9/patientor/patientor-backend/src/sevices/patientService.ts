import patientEntries from '../../data/patientEntries';
import { Patient, NonSensitivePatient } from '../types';

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

export default { getEntries, getNonSensitiveEntries };
