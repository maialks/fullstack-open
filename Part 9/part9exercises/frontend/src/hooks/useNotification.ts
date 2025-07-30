import { useContext, createContext } from 'react';

type NotificationContextType = {
  notification: string | null;
  showNotification: (message: string, delay?: number) => void;
};

const NotificationContext = createContext<null | NotificationContextType>(null);
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === null)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  return context;
};

export default NotificationContext;
