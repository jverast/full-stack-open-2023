import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { yellow } from '@mui/material/colors';

import styled from '@emotion/styled';

import { Diagnose, HealthCheckEntry, HealthCheckRating } from '../../../types';

interface Props {
  entry: HealthCheckEntry;
  diagnoses: Diagnose[];
}

const Entry = styled.div`
  border: thin solid;
  border-radius: 4px;
  padding: 5px;
  line-height: 1.25;
`;

const renderHeartColor = (hcr: HealthCheckRating): JSX.Element => {
  switch (hcr) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon color="success" />;
    case HealthCheckRating.LowRisk:
      return <FavoriteIcon sx={{ color: yellow[500] }} />;
    case HealthCheckRating.HighRisk:
      return <FavoriteIcon color="error" />;
    case HealthCheckRating.CriticalRisk:
      return <FavoriteIcon color="action" />;
    default:
      return <FavoriteIcon color="primary" />;
  }
};

const HealthCheck = ({ entry, diagnoses }: Props) => {
  return (
    <Entry>
      <div>
        {entry.date}{' '}
        <MedicalServicesIcon sx={{ position: 'relative', top: 3 }} />
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
      {renderHeartColor(entry.healthCheckRating)}
      <div>diganose by {entry.specialist}</div>
    </Entry>
  );
};

export default HealthCheck;
