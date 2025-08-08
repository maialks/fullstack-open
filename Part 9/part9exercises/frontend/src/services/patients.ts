import axios from 'axios';
import { EntryWithoutId, Patient, PatientFormValues } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const getOne = async (id: string): Promise<Patient> => {
  try {
    const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('axios error:', err.message);
    }
    throw err;
  }
};

// Função para adicionar uma nova entrada (entry) ao paciente com ID fornecido
const addEntry = async (
  id: string,
  entry: EntryWithoutId
): Promise<Patient> => {
  try {
    const { data } = await axios.post<Patient>(
      `${apiBaseUrl}/patients/${id}/entries`,
      entry
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('axios error:', error.message);

      // Trata erro específico de requisição malformada
      if (error.code === 'ERR_BAD_REQUEST') {
        const validationResponse = error?.response?.data?.error;

        // Se houver múltiplos erros de validação
        if (Array.isArray(validationResponse)) {
          const messages = validationResponse.map((err: unknown) => {
            if (typeof err === 'object' && err !== null) {
              if ('code' in err && 'message' in err && err?.code === 'custom')
                return err.message;
              if (
                'expected' in err &&
                'path' in err &&
                Array.isArray(err.path) &&
                err.expected &&
                err.path[0]
              ) {
                return `Expected ${err.expected} on ${err.path[0]} field`;
              }
            }
            return 'Unknown validation error';
          });
          // Lança todos os erros juntos, separados por quebra de linha
          throw new Error(messages.join('\n'));
        }

        // Caso seja apenas um erro de validação simples
        if (validationResponse?.expected && validationResponse?.path?.[0]) {
          throw new Error(
            `Expected ${validationResponse.expected} on ${validationResponse.path[0]} field`
          );
        } else if (validationResponse?.code === 'custom') {
          throw new Error(validationResponse.message);
        }
      }
    }
    // Caso não seja um erro do axios, apenas loga e relança
    console.error('unknown error:', error);
    throw error;
  }
};

export default {
  getAll,
  getOne,
  create,
  addEntry,
};
