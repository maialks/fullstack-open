import type { Diagnosis } from '../types';
import axios from 'axios';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

const getOne = async (code: string) => {
  try {
    const { data } = await axios.get<Diagnosis>(
      `${apiBaseUrl}/diagnoses/${code}`
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) console.error('axios error:', err.message);
    throw err;
  }
};

export default {
  getAll,
  getOne,
};
