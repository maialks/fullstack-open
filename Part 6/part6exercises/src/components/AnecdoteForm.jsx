import { create } from '../requests'
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const AnecdoteForm = () => {
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const setNotification = (msg) => {
    notificationDispatch({
      type: 'SET',
      payload: msg,
    })
  }

  const newAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: (newAnecdote) => {
      setNotification(`nova anedota criada "${newAnecdote.content}"`)
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (err) => {
      if (
        err.response.data.error ===
        'too short anecdote, must have length 5 or more'
      )
        setNotification(`anedota muito curta, o mínimo é 5 caracteres`)
    },
    onSettled: () => {
      setTimeout(() => notificationDispatch({ type: 'CLEAR' }), 3000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
