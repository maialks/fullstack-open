import { Box, Modal, Typography } from '@mui/material';
import AddEntryForm from './AddEntryForm';
import type { Patient } from '../../types';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface AddEntryModalProps {
  open: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  updatePatient: (data: Patient) => void;
}

function AddEntryModal({
  onClose,
  open,
  patientName,
  patientId,
  updatePatient,
}: AddEntryModalProps) {
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            variant='h5'
            component='h2'
            sx={{ mb: 2 }}
          >
            Add Entry to {patientName}
          </Typography>
          <AddEntryForm id={patientId} updatePatient={updatePatient} />
        </Box>
      </Modal>
    </div>
  );
}

export default AddEntryModal;
