// React
import { useEffect, useState } from 'react'
import Select from 'react-select'

// Apollo Client & GraphQL
import { useQuery, useSubscription } from '@apollo/client'
import { GET_GENRES, GET_BOOKS_AND_USER_FAVORITE, BOOK_ADDED } from '../queries'

// Components & Context
import Navbar from './Navbar'
import LoadingSpinner from './LoadingSpinner'
import Notification from './Notification'
import { useNotification } from '../context/NotificationContext'

export const updateCache = (cache, query, addedBook) => {
  const unique = (books) => {
    let seen = new Set()
    return books.filter((book) => {
      const id = book.id
      return seen.has(id) ? false : seen.add(id)
    })
  }

  cache.updateQuery(query, (data) => {
    if (!data || !data.allBooks) return
    return {
      ...data,
      allBooks: unique(data.allBooks.concat(addedBook)),
    }
  })
}

const TableStyles = {
  container: {
    marginLeft: 15,
    color: '#e0e0e0',
    backgroundColor: '#121212',
    minHeight: '100%',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  table: {
    width: '100%',
    maxWidth: 800,
    borderCollapse: 'collapse',
    marginTop: 20,
    backgroundColor: '#1e1e1e',
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thtd: {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #333',
    color: '#ccc',
  },
  th: {
    backgroundColor: '#272727',
    fontWeight: 'bold',
    color: '#f2f2f2',
  },
}

const Books = () => {
  // State Hooks
  const [genreFilter, setGenreFilter] = useState([])
  const [options, setOptions] = useState([])
  const [books, setBooks] = useState([])
  const [selectValue, setSelectValue] = useState([])

  // Query Hooks
  const { data: genresData, loading: genresLoading } = useQuery(GET_GENRES)
  const { data, loading } = useQuery(GET_BOOKS_AND_USER_FAVORITE, {
    variables: { genres: genreFilter },
  })

  const { showNotification } = useNotification()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      showNotification(
        `New book: ${addedBook.title} by ${addedBook.author.name}`
      )
      updateCache(
        client.cache,
        {
          query: GET_BOOKS_AND_USER_FAVORITE,
          variables: { genres: genreFilter },
        },
        addedBook
      )
    },
  })

  useEffect(() => {
    if (loading || !data) return
    setBooks(data.allBooks)
  }, [data, loading])

  useEffect(() => {
    if (genresLoading) return
    setOptions(genresData.genres.map((g) => ({ label: g, value: g })))
  }, [genresData, genresLoading])

  const handleSelectChange = (option) => {
    setGenreFilter(option.map((o) => o.value))
    setSelectValue(option)
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={TableStyles.container}>
          <h2>Books</h2>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  const userFav = data?.me?.favoriteGenre
  const selectStyles = {
    container: (base) => ({
      ...base,
      maxWidth: '59%',
      marginTop: 10,
    }),
    menuList: (base) => ({
      ...base,
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      border: '1px solid #333',
      padding: '8px',
      borderRadius: 4,
      width: '100%',
      boxSizing: 'border-box',
      maxHeight: '200px',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: 'transparent',
    }),
    control: (base) => ({
      ...base,
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
      border: '1px solid #333',
      borderRadius: 4,
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: 16,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#272727' : '#1e1e1e',
      borderRadius: 4,
      cursor: 'pointer',
    }),
    input: (base) => ({
      ...base,
      color: '#ffffff',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#ffffff',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#ffffff',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#121212',
    }),
  }

  const buttonStyles = {
    padding: '8px 16px',
    backgroundColor: '#272727',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 8,
    marginRight: 8,
  }

  const filterFavorite = () => {
    if (!userFav) return
    setGenreFilter([userFav])
    setSelectValue([{ label: userFav, value: userFav }])
  }

  const filterClear = () => {
    setGenreFilter([])
    setSelectValue([])
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#121212' }}>
      <Navbar />
      <Notification />
      <div style={TableStyles.container}>
        <h2>Books</h2>
        <table style={TableStyles.table}>
          <thead>
            <tr>
              <th style={{ ...TableStyles.thtd, ...TableStyles.th }}>Title</th>
              <th style={{ ...TableStyles.thtd, ...TableStyles.th }}>Author</th>
              <th style={{ ...TableStyles.thtd, ...TableStyles.th }}>
                Published
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.title}>
                <td style={TableStyles.thtd}>{b.title}</td>
                <td style={TableStyles.thtd}>{b.author.name}</td>
                <td style={TableStyles.thtd}>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 style={{ margin: '10px 0 0 5px' }}>Filter By Genre:</h3>
        <Select
          closeMenuOnSelect={false}
          isMulti
          styles={selectStyles}
          options={options}
          onChange={handleSelectChange}
          value={selectValue}
        />
        {userFav && (
          <button style={buttonStyles} onClick={filterFavorite}>
            Favorite Genre
          </button>
        )}
        <button style={buttonStyles} onClick={filterClear}>
          Show All
        </button>
      </div>
    </div>
  )
}

export default Books
