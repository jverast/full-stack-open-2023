import { useEffect, useState } from 'react';
import { Patient } from '../../types';
import { useParams } from 'react-router-dom';

import patientService from '../../services/patient';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import PatientEntry from './PatientEntry';

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async (): Promise<void> => {
      const patient = await patientService.getEntry(id);
      setPatient(patient);
    };

    fetchPatient();
  }, [id]);

  if (!patient) return null;

  return (
    <>
      <div>
        <h2>
          {patient.name}{' '}
          {patient.gender === 'male' ? <MaleIcon /> : <FemaleIcon />}
        </h2>
      </div>
      <div>
        <div>ssn: {patient.ssn}</div>
        <div>occupation: {patient.occupation}</div>
      </div>
      {patient.entries.length > 0 && (
        <div>
          <h3>entries</h3>
          {patient.entries.map((entry) => (
            <PatientEntry entry={entry} />
          ))}
        </div>
      )}
    </>
  );
};

export default PatientDetails;
