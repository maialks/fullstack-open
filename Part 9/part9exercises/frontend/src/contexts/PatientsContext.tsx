import React, { createContext, useState, useContext } from 'react';
import type { Patient } from '../types';

const PatientsContext = createContext<{
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
} | null>(null);

export const PatientsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  return (
    <PatientsContext.Provider value={{ setPatients, patients }}>
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === null)
    throw new Error('usePatients must be used within a PatientsProvider');
  return context;
};
