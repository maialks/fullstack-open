import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { PatientsProvider } from './contexts/PatientsContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PatientsProvider>
    <App />,
  </PatientsProvider>
);
