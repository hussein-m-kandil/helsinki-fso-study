import { Diagnosis, Entry, Gender, Patient } from '../types';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiErrorMessage, logError } from '../utils';
import { Female, Male } from '@mui/icons-material';
import patientService from '../services/patientService';
import Entries from './Entries';
import AddEntryForm from './AddEntryForm';

const PatientPage = ({
  patients,
  diagnoses,
  setPatients,
}: {
  patients: Patient[];
  diagnoses: Diagnosis[];
  setPatients: React.Dispatch<Patient[]>;
}) => {
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    if (id) {
      if (!patient) {
        let unmounted = false;
        patientService
          .getOne(id)
          .then((resPatient) => {
            if (!unmounted) {
              // Just to survive on the clint side in case of serverless deployment
              const patientInMemory = patients.find(
                (p) => p.id === resPatient.id
              );
              setPatient({
                ...resPatient,
                entries:
                  patientInMemory &&
                  patientInMemory.entries.length > resPatient.entries.length
                    ? [...patientInMemory.entries]
                    : resPatient.entries,
              });
            }
          })
          .catch((e) => {
            // Again, this to survive on the clint side in case of serverless deployment
            const patientInMemory = patients.find((p) => p.id === id);
            if (patientInMemory && !patient) {
              setPatient(patientInMemory);
            } else {
              logError(e);
              setErrorMessage(
                getApiErrorMessage(e, 'could not fetch any data')
              );
            }
          });
        return () => {
          unmounted = true;
        };
      }
    } else {
      setErrorMessage('invalid id');
    }
  }, [id, patient, patients]);

  const handleEntryCreated = (createdEntry: Entry) => {
    if (patient) {
      const patientIndex = patients.findIndex((p) => p.id === patient.id);
      if (patientIndex >= 0) {
        const updatedPatient = {
          ...patient,
          entries: [...patient.entries, createdEntry],
        };
        setPatient(updatedPatient);
        setPatients([
          ...patients.slice(0, patientIndex),
          updatedPatient,
          ...patients.slice(patientIndex + 1),
        ]);
      }
    }
    closeModal();
  };

  return !patient && !errorMessage ? (
    <div>Loading...</div>
  ) : (
    <div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {patient && (
        <>
          <Typography
            variant="h5"
            component="h2"
            sx={{ margin: '1rem 0', fontWeight: 'bold' }}
          >
            {patient.name}{' '}
            {patient.gender === Gender.male ? <Male /> : <Female />}
          </Typography>
          <Typography variant="body1">
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              SSN:
            </Typography>{' '}
            {patient.ssn}
          </Typography>
          <Typography variant="body1">
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              Occupation:
            </Typography>{' '}
            {patient.occupation}
          </Typography>
          <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
          <Dialog
            fullWidth={true}
            open={modalOpen}
            onClose={closeModal}
            closeAfterTransition={false}
          >
            <DialogTitle>Add a new entry</DialogTitle>
            <Divider />
            <DialogContent sx={{ padding: '1rem' }}>
              <AddEntryForm
                onEntryCreated={handleEntryCreated}
                onCancel={closeModal}
                diagnoses={diagnoses}
                patient={patient}
                key={Date.now()}
              />
            </DialogContent>
          </Dialog>
          <Entries entries={patient.entries} diagnoses={diagnoses} />
        </>
      )}
    </div>
  );
};

export default PatientPage;
