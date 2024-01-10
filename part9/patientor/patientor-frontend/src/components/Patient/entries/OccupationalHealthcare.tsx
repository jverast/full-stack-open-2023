import WorkIcon from '@mui/icons-material/Work';

import { Diagnose, OccupationalHealthcareEntry } from '../../../types';
import styled from '@emotion/styled';

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnose[];
}

const Entry = styled.div`
  border: thin solid;
  border-radius: 4px;
  padding: 5px;
  line-height: 1.25;
`;

const OccupationalHealth = ({ entry, diagnoses }: Props) => {
  return (
    <Entry>
      <div>
        {entry.date} <WorkIcon sx={{ position: 'relative', top: 3 }} />{' '}
        {entry.employerName}
      </div>
      <div>
        <em>{entry.description}</em>
      </div>
      {entry.diagnosisCodes && (
        <ul>
          {entry?.diagnosisCodes?.map((d) => (
            <li key={d}>
              {d} {diagnoses?.find((dn) => dn.code === d)?.name}
            </li>
          ))}
        </ul>
      )}
      {entry?.sickLeave && (
        <div>
          sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
        </div>
      )}
      <div>diganose by {entry.specialist}</div>
    </Entry>
  );
};

export default OccupationalHealth;
