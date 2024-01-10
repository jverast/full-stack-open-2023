import { useEffect, useState } from 'react';
import { Diagnose, Entry } from '../../types';
import diagnoseService from '../../services/diagnose';

interface Props {
  entry: Entry;
}

const PatientEntry = ({ entry }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnose[] | null>(null);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnoseService.getAll();
      setDiagnoses(diagnoses);
    };

    fetchDiagnoses();
  }, []);

  return (
    <div>
      <p>
        {entry.date} <em>{entry.description}</em>
      </p>
      <ul>
        {entry?.diagnosisCodes?.map((d) => (
          <li key={d}>
            {d} {diagnoses?.find((dn) => dn.code === d)?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientEntry;
