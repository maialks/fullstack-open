import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from './constants';
import { Diagnosis } from './types';

import diagnosesService from './services/diagnoses';
import patientService from './services/patients';

import { NotificationProvider } from './contexts/NotificationContext';
import { usePatients } from './contexts/PatientsContext';
import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';

const App = () => {
  const { patients, setPatients } = usePatients();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();

    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnoses();
  }, [setPatients]);

  return (
    <div className='App'>
      <Router>
        <NotificationProvider>
          <Container>
            <Typography variant='h3' style={{ marginBottom: '0.5em' }}>
              Patientor
            </Typography>
            <Button component={Link} to='/' variant='contained' color='primary'>
              Home
            </Button>
            <Divider hidden />
            <Routes>
              <Route
                path='/'
                element={
                  <PatientListPage
                    patients={patients}
                    setPatients={setPatients}
                  />
                }
              />
              <Route
                path='/:id'
                element={<PatientPage diagnoses={diagnoses} />}
              />
            </Routes>
          </Container>
        </NotificationProvider>
      </Router>
    </div>
  );
};

export default App;
