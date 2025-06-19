import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import { getAll, update } from '../requests'
import { useRef } from 'react'

const Anecdote = ({ anecdote, onClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes} votes
        <button onClick={onClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => {
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const timeoutId = useRef(null)

  const voteMutation = useMutation({
    mutationFn: update,
    onSuccess: (votedAnecdote) => {
      notificationDispatch({
        type: 'SET',
        payload: `você votou em "${votedAnecdote.content}"`,
      })
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((a) => (a.id === votedAnecdote.id ? votedAnecdote : a))
      )
    },
    onSettled: () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeoutId.current = setTimeout(
        () => notificationDispatch({ type: 'CLEAR' }),
        3000
      )
    },
  })

  const handleVote = (anecdote) =>
    voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })

  return (
    <>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((a) => (
          <Anecdote key={a.id} anecdote={a} onClick={() => handleVote(a)} />
        ))}
    </>
  )
}

export default AnecdoteList
