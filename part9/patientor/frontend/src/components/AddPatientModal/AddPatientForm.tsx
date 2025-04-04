import { useState, SyntheticEvent } from 'react';

import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
} from '@mui/material';

import { PatientFormValues, Gender } from '../../types';

interface Props {
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

interface GenderOption {
  value: Gender;
  label: string;
}

const genderOptions: GenderOption[] = Object.values(Gender).map((v) => ({
  value: v,
  label: v.toString(),
}));

const AddPatientForm = ({ onCancel, onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [ssn, setSsn] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState(Gender.male);

  const onGenderChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === 'string') {
      const value = event.target.value;
      const gender = Object.values(Gender).find((g) => g.toString() === value);
      if (gender) setGender(gender);
    }
  };

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({ name, occupation, ssn, dateOfBirth, gender });
  };

  return (
    <div>
      <form onSubmit={addPatient}>
        <TextField
          label="Name"
          autoComplete="on"
          name="name"
          fullWidth
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
        <TextField
          label="Social security number"
          name="ssn"
          fullWidth
          value={ssn}
          onChange={({ target }) => setSsn(target.value)}
          sx={{ marginTop: '15px' }}
        />
        <TextField
          label="Date of birth"
          placeholder="YYYY-MM-DD"
          name="dob"
          fullWidth
          value={dateOfBirth}
          onChange={({ target }) => setDateOfBirth(target.value)}
          sx={{ marginTop: '15px' }}
        />
        <TextField
          label="Occupation"
          name="occupation"
          fullWidth
          value={occupation}
          onChange={({ target }) => setOccupation(target.value)}
          sx={{ marginTop: '15px' }}
        />

        <InputLabel component="div" style={{ marginTop: 20 }}>
          Gender
        </InputLabel>
        <Select
          name="gender"
          label="Gender"
          fullWidth
          value={gender}
          onChange={onGenderChange}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
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
    </div>
  );
};

export default AddPatientForm;
