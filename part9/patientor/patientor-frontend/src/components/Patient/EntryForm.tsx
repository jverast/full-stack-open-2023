import { useState, SyntheticEvent } from 'react';
import patientService from '../../services/patient';
import { Diagnose, Entry, NewEntry } from '../../types';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';

interface Props {
  id: string;
  handlePatient: (obj: Entry) => void;
  handleError: (str: string) => void;
  diagnoses: Diagnose[];
}

type EntrySelected = 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';

const EntryForm = ({ handlePatient, id, handleError, diagnoses }: Props) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck
  const [hcr, setHcr] = useState<string>('');

  // Hospital
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');

  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>('');

  const [entrySelected, setEntrySelected] =
    useState<EntrySelected>('HealthCheck');

  const submitEntry = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    try {
      const baseProperties = {
        description,
        date,
        specialist,
        diagnosisCodes: diagnosisCodes ? diagnosisCodes : undefined
      };

      let entryToFetch;

      if (entrySelected === 'HealthCheck') {
        entryToFetch = {
          type: 'HealthCheck',
          ...baseProperties,
          healthCheckRating: Number(hcr)
        } as NewEntry;
      }

      if (entrySelected === 'Hospital') {
        entryToFetch = {
          type: 'Hospital',
          ...baseProperties,
          discharge: { date: dischargeDate, criteria: dischargeCriteria }
        } as NewEntry;
      }

      if (entrySelected === 'OccupationalHealthcare') {
        entryToFetch = {
          type: 'OccupationalHealthcare',
          ...baseProperties,
          employerName,
          sickLeave:
            (sickLeaveStartDate &&
              sickLeaveEndDate && {
                startDate: sickLeaveStartDate,
                endDate: sickLeaveEndDate
              }) ||
            undefined
        } as NewEntry;
      }

      if (!entryToFetch) return;

      // console.log(entryToFetch);
      const newEntry = await patientService.createEntry(entryToFetch, id);
      handlePatient(newEntry);

      onCancel();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            ''
          );
          console.error(message);
          handleError(message);
        } else {
          handleError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        handleError('Unknown error');
      }
    }
  };

  const onCancel = (): void => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
    setHcr('');
    setDischargeDate('');
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStartDate('');
    setSickLeaveEndDate('');
  };

  const handleDiagnosisChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box sx={{ border: '1px dashed', padding: '.65rem', marginTop: '1rem' }}>
      <h3>
        New <em>{entrySelected}</em> entry
      </h3>
      <FormControl sx={{ marginBottom: '.5rem' }}>
        <InputLabel id="entry-select">Entry Selected</InputLabel>
        <Select
          labelId="entry-select"
          value={entrySelected}
          label="Entry Selected"
          onChange={({ target }) =>
            setEntrySelected(target.value as EntrySelected)
          }
        >
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            OccupationalHealthcare
          </MenuItem>
        </Select>
      </FormControl>
      <form onSubmit={submitEntry}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Description"
              required
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              type="date"
              label=" "
              hiddenLabel
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              required
              label="Specialist"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <div>
              <FormControl sx={{ width: 300 }} style={{ marginTop: '1rem' }}>
                <Typography sx={{ color: 'rgb(118, 118, 118)' }}>
                  Diagnosis Codes
                </Typography>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={diagnosisCodes}
                  onChange={handleDiagnosisChange}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {diagnoses.map((d) => (
                    <MenuItem key={d.code} value={d.code}>
                      <Checkbox checked={diagnosisCodes.indexOf(d.code) > -1} />
                      <ListItemText primary={d.code} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </Grid>
          {entrySelected === 'HealthCheck' && (
            <Grid item xs={12}>
              <TextField
                variant="standard"
                fullWidth
                required
                label="Health Check Rating"
                value={hcr}
                onChange={({ target }) => setHcr(target.value)}
              />
            </Grid>
          )}
          {entrySelected === 'Hospital' && (
            <Grid item xs={12}>
              <Typography
                sx={{ marginTop: '1rem', color: 'rgb(118, 118, 118)' }}
              >
                Discharge
              </Typography>
              <div style={{ width: '98.5%', marginLeft: 'auto' }}>
                <TextField
                  variant="standard"
                  fullWidth
                  label=" "
                  type="date"
                  value={dischargeDate}
                  onChange={({ target }) => setDischargeDate(target.value)}
                />
                <TextField
                  variant="standard"
                  fullWidth
                  required
                  label="Criteria"
                  value={dischargeCriteria}
                  onChange={({ target }) => setDischargeCriteria(target.value)}
                />
              </div>
            </Grid>
          )}
          {entrySelected === 'OccupationalHealthcare' && (
            <>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  fullWidth
                  required
                  label="Employer Name"
                  value={employerName}
                  onChange={({ target }) => setEmployerName(target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  sx={{ marginTop: '1rem', color: 'rgb(118, 118, 118)' }}
                >
                  Sick Leave
                </Typography>
                <div style={{ width: '98.5%', marginLeft: 'auto' }}>
                  <Typography
                    sx={{
                      marginTop: '1rem',
                      marginBottom: '-1rem',
                      color: 'rgb(118, 118, 118)'
                    }}
                  >
                    Start
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    label=" "
                    type="date"
                    value={sickLeaveStartDate}
                    onChange={({ target }) =>
                      setSickLeaveStartDate(target.value)
                    }
                  />
                  <Typography
                    sx={{
                      marginTop: '1rem',
                      marginBottom: '-1rem',
                      color: 'rgb(118, 118, 118)'
                    }}
                  >
                    End
                  </Typography>
                  <TextField
                    variant="standard"
                    fullWidth
                    label=" "
                    type="date"
                    value={sickLeaveEndDate}
                    onChange={({ target }) => setSickLeaveEndDate(target.value)}
                  />
                </div>
              </Grid>
            </>
          )}
        </Grid>
        <Grid sx={{ marginBlock: '1rem' }}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: 'left' }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: 'right'
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <div style={{ clear: 'both' }} />
    </Box>
  );
};

export default EntryForm;
