import { useState } from 'react'
import useField from '../hooks/useField'
import Navbar from './Navbar'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, GET_BOOKS_AND_USER_FAVORITE } from '../queries'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const NewBook = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!token) navigate('/', { replace: true })
  }, [])

  const title = useField('text')
  const author = useField('text')
  const published = useField('number', 2025)
  const genre = useField('text')
  const [errorMessage, setErrorMessage] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, response) => {
      cache.updateQuery(
        { query: GET_BOOKS_AND_USER_FAVORITE, variables: { genres: [] } },
        ({ allBooks, me }) => {
          if (!allBooks) return
          return {
            allBooks: allBooks.concat(response.data.addBook),
            me,
          }
        }
      )
    },
    onError: (error) => {
      console.log(error)
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(''), 5000)
    },
  })

  const inputStyles = {
    container: {
      marginLeft: 15,
      color: '#e0e0e0',
      backgroundColor: '#121212',
      minHeight: '100vh',
      padding: 20,
      fontFamily: 'Arial, sans-serif',
    },
    form: {
      maxWidth: 600,
      marginTop: 20,
    },
    label: {
      display: 'block',
      marginBottom: 6,
      fontWeight: 'bold',
    },
    input: {
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      border: '1px solid #333',
      padding: '8px',
      borderRadius: 4,
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: 16,
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#272727',
      color: '#fff',
      border: 'none',
      borderRadius: 4,
      cursor: 'pointer',
      marginTop: 8,
      marginRight: 8,
    },
    genresList: {
      marginTop: 12,
      color: '#ccc',
    },
  }

  const addGenre = () => {
    const newGenre = genre.inputProps.value.trim()
    if (newGenre) {
      setGenres([...genres, newGenre])
      genre.setValue('')
    }
  }

  const submit = async (e) => {
    e.preventDefault()

    await createBook({
      variables: {
        title: title.inputProps.value,
        author: author.inputProps.value,
        published: published.inputProps.value,
        genres: genres,
      },
    })

    title.setValue('')
    author.setValue('')
    published.setValue(2025)
    genre.setValue('')
    setGenres([])
  }

  return (
    <div>
      <Navbar />
      {errorMessage && (
        <h2
          style={{
            color: 'red',
            backgroundColor: '#121212',
            padding: '10px 0px 0px 30px',
          }}
        >
          {errorMessage}
        </h2>
      )}
      <div style={inputStyles.container}>
        <h2>Add New Book</h2>
        <form onSubmit={submit} style={inputStyles.form}>
          <label style={inputStyles.label}>Title</label>
          <input {...title.inputProps} style={inputStyles.input} />

          <label style={inputStyles.label}>Author</label>
          <input {...author.inputProps} style={inputStyles.input} />

          <label style={inputStyles.label}>Published</label>
          <input {...published.inputProps} style={inputStyles.input} />

          <label style={inputStyles.label}>Genre</label>
          <input {...genre.inputProps} style={inputStyles.input} />

          <button type='button' onClick={addGenre} style={inputStyles.button}>
            Add genre
          </button>

          {genres.length > 0 && (
            <div style={inputStyles.genresList}>
              <strong>Genres:</strong> {genres.join(', ')}
            </div>
          )}

          <button type='submit' style={inputStyles.button}>
            Create Book
          </button>
        </form>
      </div>
    </div>
  )
}

export default NewBook
