import { useNotification } from '../hooks/useNotification';

function Notification() {
  const { notification } = useNotification();
  if (!notification) return null;
  return <h3>{notification}</h3>;
}

export default Notification;
