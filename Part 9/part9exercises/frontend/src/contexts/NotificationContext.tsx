import React, { useState } from 'react';
import { NotificationContext } from './notification';

// prettier-ignore
export const NotificationProvider = ({children}: {children: React.ReactNode}) => {
  const [notification, setNotification] = useState<null | string>(null);

  function showNotification  (message: string, delay: number = 2500) {
    setNotification(message);
    setTimeout(() => setNotification(null), delay);
  }

  return (
    <NotificationContext.Provider value={{notification, showNotification}}>
      {children}
    </NotificationContext.Provider>
  );
};
