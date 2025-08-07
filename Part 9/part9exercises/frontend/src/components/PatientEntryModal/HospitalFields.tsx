import { useEffect, useState } from 'react';
import type { HospitalSpecific } from '../../types';
import { FormControl, TextField, Input, Typography } from '@mui/material';

interface HospitalFieldsProps {
  onChange: (newValue: HospitalSpecific) => void;
  resetSignal: number;
  error: boolean;
}

function HospitalFields({ onChange, resetSignal, error }: HospitalFieldsProps) {
  const [criteria, setCriteria] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    onChange({ discharge: { date, criteria } });
  }, [date, criteria]);

  useEffect(() => {
    setCriteria('');
    setDate('');
  }, [resetSignal]);

  // prettier-ignore
  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>): void => 
    setCriteria(e.target.value);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setDate(e.target.value);

  return (
    <>
      <Typography variant='subtitle1' sx={{ fontSize: 18 }}>
        Discharge
      </Typography>
      <FormControl fullWidth>
        <Input
          type='date'
          required
          onChange={handleDateChange}
          error={error && date === ''}
          value={date}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          value={criteria}
          onChange={handleCriteriaChange}
          variant='standard'
          label='Description'
          required
          error={error && criteria === ''}
        />
      </FormControl>
    </>
  );
}

export default HospitalFields;
