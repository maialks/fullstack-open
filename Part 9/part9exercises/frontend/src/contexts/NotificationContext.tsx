import React, { createContext, useState, useContext } from 'react';

type NotificationContextType = {
  notification: string | null;
  showNotification: (message: string, delay?: number) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

// prettier-ignore
export const NotificationProvider = ({children}: {children: React.ReactNode}) => {
  const [notification, setNotification] = useState<null | string>(null)

  function showNotification  (message: string, delay: number = 2500) {
    setNotification(message)
    setTimeout(() => setNotification(null), delay)
  }

  return (
    <NotificationContext.Provider value={{notification, showNotification}}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === null)
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  return context;
};
