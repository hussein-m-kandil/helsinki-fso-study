import {
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Alert,
} from '@mui/material';

import AddPatientForm from './AddPatientForm';
import { PatientFormValues } from '../../types';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => void;
  error?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
  <Dialog
    closeAfterTransition={false}
    fullWidth={true}
    open={modalOpen}
    onClose={() => onClose()}
  >
    <DialogTitle>Add a new patient</DialogTitle>
    <Divider />
    <DialogContent>
      {error && (
        <Alert sx={{ marginBottom: '1rem' }} severity="error">
          {error}
        </Alert>
      )}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

export default AddPatientModal;
