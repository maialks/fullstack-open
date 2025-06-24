import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { showNotification } from '../features/notification/notificationSlice'

export default function ProtectedRoute({
  children,
  message,
  requireAuth = true,
}) {
  const { token, isLoading } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && token === null) {
      navigate('/login', { replace: true })
      dispatch(
        showNotification({
          title: 'Please Log in',
          message: message,
          type: 'info',
        })
      )
    }
    if (!requireAuth && token !== null) {
      navigate('/', { replace: true })
      dispatch(
        showNotification({
          title: 'You Are Alerady Logged In',
          message: message,
          type: 'info',
        })
      )
    }
  }, [navigate, token])

  return children
}
