import { useEffect, useState } from 'react';
import type { OccupationalHealthcareSpecific } from '../../types';
import {
  FormControl,
  TextField,
  Input,
  FormControlLabel,
  FormLabel,
  Box,
} from '@mui/material';

interface OccupationalFieldsProps {
  onChange: (newValue: OccupationalHealthcareSpecific) => void;
  resetSignal: number;
  error: boolean;
}

function OccupationalFields({
  onChange,
  resetSignal,
  error,
}: OccupationalFieldsProps) {
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    onChange({
      employerName,
      ...(sickLeave.startDate !== '' &&
        sickLeave.endDate !== '' && {
          sickLeave: {
            startDate: sickLeave.startDate,
            endDate: sickLeave.endDate,
          },
        }),
    });
  }, [employerName, sickLeave]);

  useEffect(() => {
    setEmployerName('');
    setSickLeave({ startDate: '', endDate: '' });
  }, [resetSignal]);

  // prettier-ignore
  const handleEmployerNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => 
    setEmployerName(e.target.value);

  const handleSickLeaveChange = {
    start: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSickLeave({ ...sickLeave, startDate: e.target.value }),
    end: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSickLeave({ ...sickLeave, endDate: e.target.value }),
  };

  console.log(sickLeave);

  return (
    <>
      <FormControl fullWidth>
        <TextField
          value={employerName}
          onChange={handleEmployerNameChange}
          variant='standard'
          label='Employer Name'
          required
          error={error && employerName === ''}
        />
      </FormControl>
      <FormControl>
        <FormLabel sx={{ fontSize: 18, mb: 1, color: '#000000' }}>
          Sick Leave
        </FormLabel>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <FormControl sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Input
                  sx={{ width: '100%' }}
                  type='date'
                  onChange={handleSickLeaveChange.start}
                  required={sickLeave.endDate !== ''}
                  error={
                    error &&
                    sickLeave.startDate === '' &&
                    sickLeave.endDate !== ''
                  }
                  value={sickLeave.startDate}
                />
              }
              label='Start'
              sx={{ width: '80%', alignItems: 'flex-start' }}
              labelPlacement='top'
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Input
                  sx={{ width: '100%' }}
                  required={sickLeave.startDate !== ''}
                  type='date'
                  onChange={handleSickLeaveChange.end}
                  error={
                    error &&
                    sickLeave.endDate === '' &&
                    sickLeave.startDate !== ''
                  }
                  value={sickLeave.endDate}
                />
              }
              label='End'
              sx={{ width: '80%', alignItems: 'flex-start' }}
              labelPlacement='top'
            />
          </FormControl>
        </Box>
      </FormControl>
    </>
  );
}

export default OccupationalFields;
