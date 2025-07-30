import React, { useState } from 'react';
import NotificationContext from '../hooks/useNotification';

// prettier-ignore
export const NotificationProvider = ({children}: {children: React.ReactNode})  => {
  const [notification, setNotification] = useState<string | null>(null)

  function showNotification (message: string, delay: number = 2500): void {
    setNotification(message)
    setTimeout(() => setNotification(null), delay)
  }

  return (
    <NotificationContext.Provider value={{notification, showNotification}}>
      {children}
    </NotificationContext.Provider>
  )
}
