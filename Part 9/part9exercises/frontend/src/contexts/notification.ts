import { useContext, createContext } from 'react';

type NotificationContextType = {
  notification: string | null;
  showNotification: (message: string, delay?: number) => void;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === null)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  return context;
};
