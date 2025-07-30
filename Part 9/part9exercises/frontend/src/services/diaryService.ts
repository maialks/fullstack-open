import axios from 'axios';
import type {
  DiaryEntry,
  NonSensitiveDiaryEntry,
  NewDiaryEntry,
} from '../types';
import { diaryListSchema, nonSensibleDiaryListSchema } from '../utils';
import * as z from 'zod';

const baseUrl = 'http://localhost:3000/api/diaries';

async function getNonSensitiveEntries(): Promise<NonSensitiveDiaryEntry[]> {
  try {
    const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
    return nonSensibleDiaryListSchema.parse(response.data);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.error('error parsing entries ', err);
    } else {
      console.error('unkown error fetching data', err);
    }
    throw err;
  }
}
async function getAllEntries(): Promise<DiaryEntry[]> {
  try {
    const response = await axios.get<DiaryEntry[]>(`${baseUrl}/entries`);
    return diaryListSchema.parse(response.data);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      console.error('error parsing entries ', err);
    } else {
      console.error('unkown error fetching data', err);
    }
    throw err;
  }
}

async function createEntry(newEntry: NewDiaryEntry): Promise<DiaryEntry> {
  try {
    const response = await axios.post(baseUrl, newEntry);
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) throw err;
    else throw new Error('unknown error' + err);
  }
}

export default { getNonSensitiveEntries, getAllEntries, createEntry };
