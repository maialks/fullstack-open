import { useNotification } from '../context/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) return null

  return (
    <div
      style={{
        background: 'lightgreen',
        padding: '10px',
        margin: '10px',
        borderRadius: 10,
      }}
    >
      {notification}
    </div>
  )
}

export default Notification
