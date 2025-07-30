import * as z from 'zod';
import { VISIBILITY_VALUES, WEATHER_VALUES } from './types';

export const diaryEntrySchema = z.object({
  id: z.number(),
  weather: z.enum(WEATHER_VALUES),
  visibility: z.enum(VISIBILITY_VALUES),
  date: z.iso.date(),
  comment: z.string(),
});

export const diaryListSchema = z.array(diaryEntrySchema);
export const nonSensibleDiaryListSchema = z.array(
  diaryEntrySchema.omit({ comment: true })
);
