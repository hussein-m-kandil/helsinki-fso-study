import { useState, useMemo, SyntheticEvent } from 'react';
import patientService from '../services/patientService';
import {
  SelectChangeEvent,
  InputLabel,
  TextField,
  FormGroup,
  MenuItem,
  Switch,
  Select,
  Button,
  Alert,
  Input,
  Grid,
  Radio,
  FormLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import {
  DiagnosisCode,
  Diagnosis,
  Patient,
  Entry,
  EntryType,
  HealthCheckRating,
} from '../types';
import { assertNever, getApiErrorMessage, logError } from '../utils';
import { isAxiosError } from 'axios';

interface EntryTypeOption {
  value: EntryType;
  label: string;
}

const entryTypeOptions: EntryTypeOption[] = Object.values(EntryType).map(
  (v) => ({
    value: v,
    label: v.toString(),
  })
);

const formatDate = (deltaDays?: number): string => {
  const dateObj = deltaDays
    ? new Date(Date.now() - deltaDays * 24 * 60 * 60 * 1000)
    : new Date();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = String(dateObj.getFullYear());
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const AddEntryForm = ({
  patient,
  onCancel,
  diagnoses,
  onEntryCreated,
}: {
  patient: Patient;
  onCancel: () => void;
  diagnoses: Diagnosis[];
  onEntryCreated: (createdEntry: Entry) => void;
}) => {
  const todayDate = formatDate();

  const [date, setDate] = useState(todayDate);
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<DiagnosisCode[]>([]);
  const [entryType, setEntryType] = useState(EntryType.HealthCheck);
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [dischargeDate, setDischargeDate] = useState(todayDate);
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const diagnosisCodesOptions = useMemo(
    () => diagnoses.map((d) => d.code),
    [diagnoses]
  );

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const chosenEntryType = Object.values(EntryType).find(
        (et) => et.toString() === value
      );
      if (chosenEntryType) setEntryType(chosenEntryType);
    }
  };

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();
    const newEntry = {
      date,
      specialist,
      description,
      diagnosisCodes,
      ...(() => {
        switch (entryType) {
          case EntryType.HealthCheck:
            return { type: entryType, healthCheckRating };
          case EntryType.Hospital:
            return {
              type: entryType,
              discharge: { date: dischargeDate, criteria: dischargeCriteria },
            };
          case EntryType.OccupationalHealthcare:
            return {
              type: entryType,
              employerName,
              ...(startDate || endDate
                ? { sickLeave: { startDate, endDate } }
                : {}),
            };
          default:
            return assertNever(entryType);
        }
      })(),
    };
    const handleSuccessfulCreation = (createdEntry: Entry) => {
      onEntryCreated(createdEntry);
      setErrorMessage('');
    };
    patientService
      .createEntry(patient.id, newEntry)
      .then(handleSuccessfulCreation)
      .catch((e) => {
        // Just to survive on the clint side in case of serverless deployment
        if (
          isAxiosError(e) &&
          e.response?.data.error?.message &&
          e.response.data.error.message === 'invalid patient id'
        ) {
          handleSuccessfulCreation({
            ...newEntry,
            id: `${newEntry.date}-${Math.floor(Math.random() * 1e9)}`,
          });
        } else {
          throw e;
        }
      })
      .catch((error: unknown) => {
        logError(error);
        setErrorMessage(
          getApiErrorMessage(
            error,
            'could not create the entry! Try again later.'
          )
        );
      });
  };

  return (
    <form onSubmit={addPatient}>
      {errorMessage && (
        <Alert sx={{ marginBottom: '1rem' }} severity="error">
          {errorMessage}
        </Alert>
      )}
      <InputLabel sx={{ fontSize: 'small', lineHeight: '0.85' }}>
        Date
        <br />
        <Input
          fullWidth
          name="date"
          value={date}
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
      </InputLabel>
      <TextField
        fullWidth
        name="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ marginTop: '15px' }}
      />
      <TextField
        fullWidth
        name="specialist"
        label="Specialist"
        value={specialist}
        onChange={(e) => setSpecialist(e.target.value)}
        sx={{ marginTop: '15px' }}
      />
      <FormControl fullWidth sx={{ marginTop: '15px' }}>
        <InputLabel component="div" id="diagnosis-codes-label">
          Diagnosis Codes
        </InputLabel>
        <Select
          multiple
          fullWidth
          value={diagnosisCodes}
          name="diagnosis-codes"
          label="Diagnosis Codes"
          labelId="diagnosis-codes-label"
          onChange={(e) => {
            const codes = e.target.value;
            setDiagnosisCodes(Array.isArray(codes) ? codes : [codes]);
          }}
        >
          {diagnosisCodesOptions.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: '15px' }}>
        <InputLabel component="div" id="type-select-label">
          Type
        </InputLabel>
        <Select
          fullWidth
          name="type"
          label="Type"
          value={entryType}
          labelId="type-select-label"
          onChange={onEntryTypeChange}
        >
          {entryTypeOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {(() => {
        switch (entryType) {
          case EntryType.HealthCheck:
            return (
              <FormControl fullWidth sx={{ marginTop: '15px' }}>
                <FormLabel component={'div'} id="health-check-rating-label">
                  Health Check Rating
                </FormLabel>
                <RadioGroup
                  sx={{ flexDirection: 'row' }}
                  aria-labelledby="health-check-rating-label"
                  name="health-check-rating"
                  value={healthCheckRating}
                  onChange={(e) => {
                    setHealthCheckRating(Number(e.target.value));
                  }}
                >
                  {Object.entries(HealthCheckRating)
                    .filter(([_, v]) => typeof v === 'number')
                    .map(([k, v]) => (
                      <FormControlLabel
                        key={k}
                        value={v}
                        label={k}
                        control={<Radio />}
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            );
          case EntryType.Hospital:
            return (
              <>
                <InputLabel sx={{ marginTop: '15px' }}>
                  Discharge Date
                  <br />
                  <Input
                    fullWidth
                    name="discharge-date"
                    value={dischargeDate}
                    type="date"
                    onChange={(e) => setDischargeDate(e.target.value)}
                  />
                </InputLabel>
                <TextField
                  fullWidth
                  name="discharge-criteria"
                  label="Discharge Criteria"
                  value={dischargeCriteria}
                  onChange={(e) => setDischargeCriteria(e.target.value)}
                  sx={{ marginTop: '15px' }}
                />
              </>
            );
          case EntryType.OccupationalHealthcare:
            return (
              <>
                <TextField
                  fullWidth
                  name="employer-name"
                  label="Employer Name"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  sx={{ marginTop: '15px' }}
                />
                <FormGroup sx={{ marginTop: '15px' }}>
                  <FormControlLabel
                    label="Is sick left?"
                    control={
                      <Switch
                        name="sick-leave"
                        checked={sickLeave}
                        onChange={() => setSickLeave(!sickLeave)}
                      />
                    }
                  />
                  <Grid
                    container
                    sx={{ flexGrow: 1, justifyContent: 'space-between' }}
                  >
                    <InputLabel sx={{ fontSize: 'small', lineHeight: '0.85' }}>
                      Start Date
                      <br />
                      <Input
                        type="date"
                        name="start-date"
                        value={startDate}
                        disabled={!sickLeave}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </InputLabel>
                    <InputLabel sx={{ fontSize: 'small', lineHeight: '0.85' }}>
                      End Date
                      <br />
                      <Input
                        type="date"
                        name="end-date"
                        value={endDate}
                        disabled={!sickLeave}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </InputLabel>
                  </Grid>
                </FormGroup>
              </>
            );
          default:
            return assertNever(entryType);
        }
      })()}
      <Grid
        container
        sx={{
          flexGrow: 1,
          marginTop: '1.5rem',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="button"
          color="secondary"
          variant="contained"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Add
        </Button>
      </Grid>
    </form>
  );
};

export default AddEntryForm;
