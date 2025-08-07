import { useEffect, useState } from 'react';
import type { HealthCheckSpecific } from '../../types';
import { HealthCheckRating } from '../../types';
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';

interface HealthCheckFieldsProps {
  onChange: (newValue: HealthCheckSpecific) => void;
  resetSignal: number;
  error: boolean;
}

function HealthCheckFields({
  onChange,
  resetSignal,
  error,
}: HealthCheckFieldsProps) {
  const [rating, setRating] = useState<'' | number>('');

  useEffect(() => {
    onChange({ healthCheckRating: 1 });
  }, [rating]);

  useEffect(() => {
    setRating('');
  }, [resetSignal]);

  const isValidRating = (rating: unknown): rating is HealthCheckRating => {
    if (!rating || !(Number(rating) in HealthCheckRating)) return false;
    return true;
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRating(
      isValidRating(e.target.value)
        ? (Number(e.target.value) as HealthCheckRating)
        : rating
    );
  };

  const ratingEntries = Object.entries(HealthCheckRating);
  console.log(ratingEntries.slice(Math.floor(ratingEntries.length / 2)));

  return (
    <>
      <FormControl error={error && rating === ''}>
        <FormLabel sx={{ fontSize: 22, mb: 1 }}>Select Rating*</FormLabel>
        <RadioGroup value={rating} onChange={handleRatingChange} row>
          {ratingEntries
            .slice(Math.floor(ratingEntries.length / 2))
            .map((rating) => (
              <FormControlLabel
                key={rating[0]}
                value={rating[1]}
                control={<Radio />}
                label={rating[0].replace(/([A-Z])/g, ' $1').trim()}
              />
            ))}
        </RadioGroup>
      </FormControl>
    </>
  );
}

export default HealthCheckFields;
