import { useState, SyntheticEvent } from 'react';
import patientService from '../../services/patient';
import { Entry, NewEntry } from '../../types';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

interface Props {
  id: string;
  handlePatient: (obj: Entry) => void;
  handleError: (str: string) => void;
}

type EntrySelected = 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';

const EntryForm = ({ handlePatient, id, handleError }: Props) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCode] = useState<string>('');

  const [hcr, setHcr] = useState<string>('');

  const [discharge, setDischarge] = useState<string>('');

  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeave, setSickLeave] = useState<string>('');

  const [entrySelected, setEntrySelected] =
    useState<EntrySelected>('HealthCheck');

  const submitEntry = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    try {
      const baseProperties = {
        description,
        date,
        specialist,
        diagnosisCodes: diagnosisCodes
          ? diagnosisCodes.split(',').map((d) => d.trim())
          : undefined
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
        const [date, criteria] = discharge.split(',').map((v) => v.trim());

        entryToFetch = {
          type: 'Hospital',
          ...baseProperties,
          discharge: { date, criteria }
        } as NewEntry;
      }

      if (entrySelected === 'OccupationalHealthcare') {
        const [startDate, endDate] = sickLeave.split(',').map((v) => v.trim());

        entryToFetch = {
          type: 'OccupationalHealthcare',
          ...baseProperties,
          employerName,
          sickLeave: (sickLeave && { startDate, endDate }) || undefined
        } as NewEntry;
      }

      if (!entryToFetch) return;

      console.log(entryToFetch);
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
    setDiagnosisCode('');
    setHcr('');
    setDischarge('');
    setEmployerName('');
    setSickLeave('');
  };

  return (
    <Box sx={{ border: '1px dashed', padding: '.65rem', marginTop: '1rem' }}>
      <h3>
        New <em>{entrySelected}</em> entry
      </h3>
      <FormControl>
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
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Date"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Specialist"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              fullWidth
              label="Diagnosis Codes"
              value={diagnosisCodes}
              onChange={({ target }) => setDiagnosisCode(target.value)}
            />
          </Grid>
          {entrySelected === 'HealthCheck' && (
            <Grid item xs={12}>
              <TextField
                variant="standard"
                fullWidth
                label="Health Check Rating"
                value={hcr}
                onChange={({ target }) => setHcr(target.value)}
              />
            </Grid>
          )}
          {entrySelected === 'Hospital' && (
            <Grid item xs={12}>
              <TextField
                variant="standard"
                fullWidth
                label="Discharge"
                value={discharge}
                onChange={({ target }) => setDischarge(target.value)}
              />
            </Grid>
          )}
          {entrySelected === 'OccupationalHealthcare' && (
            <>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Employer Name"
                  value={employerName}
                  onChange={({ target }) => setEmployerName(target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  fullWidth
                  label="Sick Leave"
                  value={sickLeave}
                  onChange={({ target }) => setSickLeave(target.value)}
                />
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
