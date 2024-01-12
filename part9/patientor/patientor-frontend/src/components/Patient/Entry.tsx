import Hospital from './entries/Hospital';
import HealthCheck from './entries/HealthCheck';
import OccupationalHealth from './entries/OccupationalHealthcare';
import { Diagnose, Entry } from '../../types';

interface Props {
  entry: Entry;
  diagnoses: Diagnose[];
}

const EntryDetails = ({ entry, diagnoses }: Props) => {
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
