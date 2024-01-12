import { useState, SyntheticEvent } from 'react';
import patientService from '../../services/patient';
import { Entry, NewEntry } from '../../types';
import axios from 'axios';
import { Box, Button, Grid, TextField } from '@mui/material';

interface Props {
  id: string;
  handlePatient: (obj: Entry) => void;
  handleError: (str: string) => void;
}

const EntryForm = ({ handlePatient, id, handleError }: Props) => {
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [hcr, setHcr] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCode] = useState<string>('');

  const submitEntry = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    try {
      const entryToFetch: NewEntry = {
        type: 'HealthCheck',
        description,
        date,
        specialist,
        healthCheckRating: Number(hcr),
        diagnosisCodes: diagnosisCodes
          ? diagnosisCodes.split(',').map((d) => d.trim())
          : undefined
      };
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
    setHcr('');
    setDiagnosisCode('');
  };

  return (
    <Box sx={{ border: '1px dashed', padding: '.65rem', marginTop: '1rem' }}>
      <h3>New HealthCheck entry</h3>
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
              label="Health Check Rating"
              value={hcr}
              onChange={({ target }) => setHcr(target.value)}
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
