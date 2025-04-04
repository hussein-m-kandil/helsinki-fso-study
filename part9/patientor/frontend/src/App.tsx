import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography, Alert } from '@mui/material';
import axios from 'axios';

import { getApiErrorMessage, logError } from './utils';
import { apiBaseUrl } from './constants';
import { Diagnosis, Patient } from './types';

import patientService from './services/patientService';
import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';
import diagnosisService from './services/diagnosisService';

const App = () => {
  const [diagnoses, setDiagnosis] = useState<Diagnosis[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const createErrorHandler = useCallback(
    (message: string) => (error: unknown) => {
      logError(error);
      setErrorMessage(getApiErrorMessage(error, message));
    },
    []
  );

  useEffect(() => {
    void axios
      .get<void>(`${apiBaseUrl}/ping`)
      .catch(createErrorHandler('could not fetch any data'));

    patientService
      .getAll()
      .then((ps) => setPatients(ps))
      .catch(createErrorHandler('could not fetch patients data'));

    diagnosisService
      .getAll()
      .then((ds) => setDiagnosis(ds))
      .catch(createErrorHandler('could not fetch diagnosis data'));
  }, [createErrorHandler]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography
            variant="h3"
            component="h1"
            sx={{ marginBottom: '0.5em' }}
          >
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          {errorMessage && (
            <Alert severity="error" sx={{ margin: '1rem 0' }}>
              {errorMessage}
            </Alert>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
            <Route
              path="/:id"
              element={
                <PatientPage
                  patients={patients}
                  diagnoses={diagnoses}
                  setPatients={setPatients}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
