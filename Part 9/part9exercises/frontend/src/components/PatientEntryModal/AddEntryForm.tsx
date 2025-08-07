// React / Components
import React, { useState, useEffect } from 'react';
import HospitalFields from './HospitalFields';
import HealthCheckFields from './HealthCheckFields';
import OccupationalFields from './OccupationalFields';
import { useNotification } from '../../contexts/NotificationContext';
import { usePatients } from '../../contexts/PatientsContext';

// Utils
import diagnoseServices from '../../services/diagnoses';
import patientServices from '../../services/patients';

// MUI Components
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Input,
  Divider,
  Button,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

// Types / Enums
import type { SelectChangeEvent } from '@mui/material/Select';
type EntryType = (typeof entryTypes)[number];
import {
  entryTypes,
  Diagnosis,
  EntrySpecificsUinion,
  EntryWithoutId,
  Patient,
} from '../../types';

function AddEntryForm({
  id,
  updatePatient,
}: {
  id: string;
  updatePatient: (data: Patient) => void;
}) {
  const [type, setType] = useState<'' | EntryType>('');
  const [diagnosisCodes, setdiagnosisCodes] = useState<Diagnosis[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specifics, setSpecifics] = useState<EntrySpecificsUinion | null>(null);
  const [resetSignal, setResetSignal] = useState<0 | 1>(0);
  const [submitError, setSubmitError] = useState(false);
  const { showNotification } = useNotification();
  const { patients, setPatients } = usePatients();

  useEffect(() => {
    diagnoseServices.getAll().then((data) => setdiagnosisCodes(data));
  }, []);

  const handleTypeSelectChange = (e: SelectChangeEvent): void =>
    setType(e.target.value as EntryType);

  const handleCodesSelectChange = (e: SelectChangeEvent<string[]>): void => {
    const { value } = e.target;
    setSelectedCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSpecialistChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setSpecialist(e.target.value);

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setDescription(e.target.value);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setDate(e.target.value);

  const handleSpecificsChange = (newValue: EntrySpecificsUinion): void =>
    setSpecifics(newValue);

  const clearFields = (): void => {
    setType('');
    setdiagnosisCodes([]);
    setSelectedCodes([]);
    setSpecialist('');
    setDescription('');
    setDate('');
    setResetSignal(resetSignal === 0 ? 1 : 0);
  };

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const formValues = {
      type,
      date,
      specialist,
      description,
      ...(selectedCodes.length && { diagnosisCodes: selectedCodes }),
      ...specifics,
    };
    const missingField = Object.values(formValues).some(
      (v: unknown) => v == false || (Array.isArray(v) && v.length === 0)
    );
    if (missingField) {
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 2500);
    } else {
      patientServices
        .addEntry(id, formValues as EntryWithoutId)
        .then((res) => {
          setPatients(patients.map((p) => (p.id === id ? res : p)));
          updatePatient(res);
          clearFields();
        })
        .catch((error: unknown) => {
          if (error instanceof Error) showNotification(error.message, 3500);
          console.log(error);
        });
    }
  }

  return (
    <div>
      <Box
        component='form'
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {/* Type */}
        <FormControl fullWidth>
          <InputLabel id='type-label'>Type</InputLabel>
          <Select
            labelId='type-label'
            label='Type'
            onChange={handleTypeSelectChange}
            value={type}
            required
            error={submitError && type === ''}
          >
            {entryTypes.map((type) => (
              <MenuItem value={type as string} key={type as string}>
                {type.replace(/([A-Z])/g, ' $1')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Specialist */}
        <FormControl fullWidth>
          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              id='input-with-sx'
              label='Specialist'
              value={specialist}
              onChange={handleSpecialistChange}
              variant='standard'
              fullWidth
              required
              error={submitError && specialist === ''}
            />
          </Box>
        </FormControl>
        {/* Description */}
        <FormControl fullWidth>
          <TextField
            value={description}
            onChange={handleDescChange}
            variant='standard'
            label='Description'
            required
            error={submitError && description === ''}
          />
        </FormControl>
        {/* Date */}
        <FormControl fullWidth>
          <Input
            type='date'
            required
            onChange={handleDateChange}
            value={date}
            error={submitError && date === ''}
          />
        </FormControl>
        {/* Diagnosis Codes */}
        <FormControl fullWidth>
          <InputLabel id='diagnosis-label'>Diagnosis Codes</InputLabel>
          <Select
            labelId='diagnosis-label'
            label='Diagnosis Codes'
            onChange={handleCodesSelectChange}
            multiple
            value={selectedCodes}
          >
            {diagnosisCodes.map((d) => (
              <MenuItem value={d.code} key={d.code}>
                {`${d.code} - ${d.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {type !== '' && <Divider />}
        {type === 'Hospital' && (
          <HospitalFields
            onChange={handleSpecificsChange}
            resetSignal={resetSignal}
            error={submitError}
          />
        )}
        {type === 'HealthCheck' && (
          <HealthCheckFields
            onChange={handleSpecificsChange}
            resetSignal={resetSignal}
            error={submitError}
          />
        )}
        {type === 'OccupationalHealthcare' && (
          <OccupationalFields
            onChange={handleSpecificsChange}
            resetSignal={resetSignal}
            error={submitError}
          />
        )}
        {type !== '' && (
          <Button variant='contained' color='secondary' onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Box>
    </div>
  );
}

export default AddEntryForm;
