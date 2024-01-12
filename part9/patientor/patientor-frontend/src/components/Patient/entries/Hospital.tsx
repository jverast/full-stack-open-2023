import SwitchCameraIcon from '@mui/icons-material/SwitchCamera';

import { Diagnose, HospitalEntry } from '../../../types';
import styled from '@emotion/styled';

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnose[];
}

const Entry = styled.div`
  border: thin solid;
  border-radius: 4px;
  padding: 0.65rem;
  line-height: 1.25;
`;

const Hospital = ({ entry, diagnoses }: Props) => {
  return (
    <Entry>
      <div>
        {entry.date} <SwitchCameraIcon sx={{ position: 'relative', top: 5 }} />
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
      <div>
        discharge: {entry.discharge.criteria} {entry.discharge.date}
      </div>
      <div>diganose by {entry.specialist}</div>
    </Entry>
  );
};

export default Hospital;
