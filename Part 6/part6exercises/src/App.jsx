import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdoteList from './components/AnecdoteList'
import { useQuery } from '@tanstack/react-query'
import { getAll } from './requests'

const App = () => {
  const res = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
  })
  if (res.isLoading) {
    return <div> loading... </div>
  }
  if (res.isError) {
    return <div> service not avalible due to problems on the server </div>
  }
  const anecdotes = res.data

  return (
    <div>
      <h3>Anecdote App</h3>
      <Notification />
      <AnecdoteForm />
      <AnecdoteList anecdotes={anecdotes} />
    </div>
  )
}

export default App
