import { useEffect, useState } from 'react';
import { Diagnose, Entry, Patient } from '../../types';
import { useParams } from 'react-router-dom';

import patientService from '../../services/patient';
import diagnoseService from '../../services/diagnose';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import EntryDetails from './Entry';

import styled from '@emotion/styled';
import EntryForm from './EntryForm';
import Notify from '../Notify';

const EntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [message, setMessage] = useState<string>('');
  const [diagnoses, setDiagnoses] = useState<Diagnose[] | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async (): Promise<void> => {
      const patient = await patientService.getPatient(id);
      setPatient(patient);
    };

    fetchPatient();
  }, [id]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };

    fetchDiagnoses();
  }, []);

  const handlePatient = (newEntry: Entry): void => {
    if (!patient) return;

    // console.log(newEntry);
    setPatient({ ...patient, entries: [...patient.entries, newEntry] });
  };

  const handleError = (text: string): void => {
    setMessage(text);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  if (!patient || !id || !diagnoses) return null;

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
      <Notify message={message} />
      <EntryForm
        handlePatient={handlePatient}
        handleError={handleError}
        diagnoses={diagnoses}
        id={id}
      />
      {patient.entries.length > 0 && (
        <div>
          <h3>entries</h3>
          <EntryContainer>
            {patient.entries.map((entry) => (
              <EntryDetails
                key={entry.id}
                entry={entry}
                diagnoses={diagnoses}
              />
            ))}
          </EntryContainer>
        </div>
      )}
    </>
  );
};

export default PatientDetails;
