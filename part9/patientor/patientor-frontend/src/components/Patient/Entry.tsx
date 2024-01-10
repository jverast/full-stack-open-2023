import { useEffect, useState } from 'react';
import { Diagnose, Entry } from '../../types';
import diagnoseService from '../../services/diagnose';

import Hospital from './entries/Hospital';
import HealthCheck from './entries/HealthCheck';
import OccupationalHealth from './entries/OccupationalHealthcare';

interface Props {
  entry: Entry;
}

const EntryDetails = ({ entry }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnose[] | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };

    fetchDiagnoses();
  }, []);

  if (!diagnoses) return null;

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheck entry={entry} diagnoses={diagnoses} />;
    case 'Hospital':
      return <Hospital entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealth entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
