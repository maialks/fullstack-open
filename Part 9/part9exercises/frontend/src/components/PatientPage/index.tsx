import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
import { Patient, Diagnosis } from '../../types';
import patientServices from '../../services/patients';
import EntriesList from './PatientEntries';
import AddEntryModal from '../PatientEntryModal';
import Notification from '../Notification';
import { usePatients } from '../../contexts/PatientsContext';

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

const PatientPage: React.FC<PatientPageProps> = ({ diagnoses }) => {
  const [patient, setPatient] = useState<{
    data: Patient | null;
    loading: boolean;
  }>({ data: null, loading: true });
  const { patients } = usePatients();

  const [modalOpen, setModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch patient data when component mounts or id changes
  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    if (patients.length) {
      const patient = patients.find((p) => p.id === id);
      if (patient !== undefined) {
        setPatient({ data: patient, loading: false });
      }
    }
    const fetchPatient = async () => {
      try {
        const patientData = await patientServices.getOne(id);
        setPatient({ data: patientData, loading: false });
      } catch (error) {
        console.error('Error fetching patient:', error);
        setPatient({ data: null, loading: false });
        navigate('/');
      }
    };

    fetchPatient();
  }, [id, navigate]);

  // Render loading / not found state
  if (patient.loading) return <Typography variant='h3'>Loading...</Typography>;
  if (!patient.data)
    return <Typography variant='h3'>Patient not found</Typography>;

  const { name, gender, occupation, ssn, entries } = patient.data;

  const closeModal = (): void => setModalOpen(false);
  const openModal = (): void => setModalOpen(true);
  const updatePatient = (data: Patient): void =>
    setPatient({ data, loading: false });

  // Render patient details
  return (
    <div>
      <Notification />
      <Typography variant='h4' sx={{ mt: 2 }}>
        {name} {gender === 'male' ? '♂' : gender === 'female' ? '♀' : ''}
      </Typography>
      {ssn && <Typography variant='body1'>SSN: {ssn}</Typography>}
      <Typography variant='body1'>Occupation: {occupation}</Typography>
      <Box>
        <Typography variant='h5'>Entries:</Typography>
        {entries && <EntriesList entries={entries} diagnosesData={diagnoses} />}
        <Button variant='contained' onClick={openModal}>
          Add New Entry
        </Button>
        <AddEntryModal
          onClose={closeModal}
          open={modalOpen}
          patientName={name}
          patientId={id as string}
          updatePatient={updatePatient}
        />
      </Box>
    </div>
  );
};

export default PatientPage;
