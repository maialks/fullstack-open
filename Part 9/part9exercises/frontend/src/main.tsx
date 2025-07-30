import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext.tsx';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>
);
