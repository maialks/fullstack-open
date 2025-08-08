import React, { useState } from 'react';
import { PatientsContext } from './patients';
import type { Patient } from '../types';

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
