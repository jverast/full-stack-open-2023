import {
  Diagnose,
  Discharge,
  Gender,
  HealthCheckRating,
  NewEntry,
  NewPatient,
  SickLeave
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isObject = (obj: unknown): obj is object => {
  return typeof obj === 'object' || obj instanceof Object;
};

const isNumber = (value: unknown): value is number => {
  return !isNaN(Number(value));
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((v) => String(v))
    .includes(String(param));
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error(`Incorrect or missing name ${name}`);
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error(`Incorrect or missing dateOfBirth '${dateOfBirth}'`);
  }
  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error(`Incorrect or missing name: '${ssn}'`);
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: '${gender}'`);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error(`Incorrect or missing occupattion '${occupation}'`);
  }
  return occupation;
};

const toNewPatient = (obj: unknown): NewPatient => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in obj &&
    'dateOfBirth' in obj &&
    'ssn' in obj &&
    'gender' in obj &&
    'occupation' in obj
  ) {
    const newEntry = {
      name: parseName(obj.name),
      dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
      ssn: parseSsn(obj.ssn),
      gender: parseGender(obj.gender),
      occupation: parseOccupation(obj.occupation)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date '${date}'`);
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error(`Incorrect or missing specialist '${specialist}'`);
  }
  return specialist;
};

const parseDiagnosisCodes = (obj: unknown): Array<Diagnose['code']> => {
  if (!obj || !isObject(obj) || !('diagnosisCodes' in obj)) {
    return [] as Array<Diagnose['code']>;
  }
  return obj.diagnosisCodes as Array<Diagnose['code']>;
};

const parseHealthCheckRating = (hcr: unknown): HealthCheckRating => {
  if (!isNumber(hcr) || !isHealthCheckRating(hcr)) {
    throw new Error(`Incorrect or missing health check rating '${hcr}'`);
  }
  return hcr;
};

const parseDischarge = (obj: unknown): Discharge => {
  if (!isObject(obj) || !('date' in obj) || !('criteria' in obj)) {
    throw new Error('Incorrect or missing discharge');
  }
  return obj as Discharge;
};

const parseEmployerName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error(`Incorrect or missing employer name '${name}'`);
  }
  return name;
};

const parseSickLeave = (obj: unknown): SickLeave => {
  if (
    !obj ||
    !isObject(obj) ||
    !('sickLeave' in obj) ||
    !isObject(obj.sickLeave) ||
    !('startDate' in obj.sickLeave) ||
    typeof obj.sickLeave.startDate !== 'string' ||
    !isDate(obj.sickLeave.startDate) ||
    !('endDate' in obj.sickLeave) ||
    typeof obj.sickLeave.endDate !== 'string' ||
    !isDate(obj.sickLeave.endDate)
  ) {
    return {} as SickLeave;
  }
  return obj.sickLeave as SickLeave;
};

const toNewEntry = (obj: unknown): NewEntry => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'type' in obj &&
    'description' in obj &&
    'date' in obj &&
    'specialist' in obj
  ) {
    const commonProperties = {
      description: parseDescription(obj.description),
      date: parseDate(obj.date),
      specialist: parseSpecialist(obj.specialist)
    };

    if ('healthCheckRating' in obj) {
      const newHealthCheckEntry: NewEntry = {
        ...commonProperties,
        type: obj.type as 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(obj.healthCheckRating),
        diagnosisCodes: parseDiagnosisCodes(obj)
      };
      return newHealthCheckEntry;
    }

    if ('discharge' in obj) {
      const newHospitalEntry: NewEntry = {
        ...commonProperties,
        type: obj.type as 'Hospital',
        discharge: parseDischarge(obj.discharge),
        diagnosisCodes: parseDiagnosisCodes(obj)
      };

      return newHospitalEntry;
    }

    if ('employerName' in obj) {
      const newOccupationalHealthcare: NewEntry = {
        ...commonProperties,
        type: obj.type as 'OccupationalHealthcare',
        employerName: parseEmployerName(obj.employerName),
        sickLeave: parseSickLeave(obj),
        diagnosisCodes: parseDiagnosisCodes(obj)
      };
      return newOccupationalHealthcare;
    }
  }

  throw new Error('Incorrect data: some fields are missing');
};

export { toNewPatient, toNewEntry };
