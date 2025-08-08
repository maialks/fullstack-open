import React, { createContext, useContext } from 'react';
import type { Patient } from '../types';

export const PatientsContext = createContext<{
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
} | null>(null);

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === null)
    throw new Error('usePatients must be used within a PatientsProvider');
  return context;
};
