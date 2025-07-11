import Navbar from './Navbar'
import { GET_AUTHORS, EDIT_AUTHOR } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import LoadingSpinner from './LoadingSpinner'
import { useRef, useState } from 'react'
import Select from 'react-select'

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#f2f2f2',
    fontFamily: 'sans-serif',
    padding: '2rem',
    marginLeft: 15,
    minHeight: '100%',
  },
  authorUpdateContainer: {
    marginTop: 15,
  },
}

const inputStyles = {
  form: {
    maxWidth: 600,
    marginTop: 20,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    fontWeight: 'bold',
    marginLeft: '0.3ch',
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

const tableStyles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    backgroundColor: '#1e1e1e',
    maxWidth: '800px',
  },
  thtd: {
    padding: '12px 16px',
    borderBottom: '1px solid #333',
    textAlign: 'left',
    color: '#ccc',
  },
  th: {
    backgroundColor: '#272727',
    color: '#f2f2f2',
  },
}

const selectStyles = {
  menuList: (base, state) => ({
    ...base,
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
    border: '1px solid #333',
    padding: '8px',
    borderRadius: 4,
    width: '100%',
    boxSizing: 'border-box',
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
}

const Authors = () => {
  const { loading, data } = useQuery(GET_AUTHORS)
  const [selected, setSelected] = useState(null)
  const dateRef = useRef(null)
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  })

  if (loading) {
    return <LoadingSpinner />
  }

  const handleChange = (option) => setSelected(option)

  const submit = (e) => {
    e.preventDefault()
    const born = +dateRef.current.value.split('-')[0]
    editAuthor({ variables: { name: selected.value, born } })
  }

  const options = data.allAuthors.map((a) => {
    return { value: a.name, label: a.name }
  })

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Authors</h2>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={{ ...tableStyles.thtd, ...tableStyles.th }}></th>
              <th style={{ ...tableStyles.thtd, ...tableStyles.th }}>Born</th>
              <th style={{ ...tableStyles.thtd, ...tableStyles.th }}>Books</th>
            </tr>
          </thead>
          <tbody>
            {data.allAuthors.map((a) => (
              <tr key={a.name}>
                <td style={tableStyles.thtd}>{a.name}</td>
                <td style={tableStyles.thtd}>{a.born || '----'}</td>
                <td style={tableStyles.thtd}>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={styles.authorUpdateContainer}>
          <h3>Add Birth Year</h3>
          <form style={inputStyles.form}>
            <label style={inputStyles.label}>Author's Name</label>
            <div>
              <Select
                options={options}
                styles={selectStyles}
                onChange={handleChange}
              />
            </div>
            <label style={inputStyles.label}>Born In</label>
            <input style={inputStyles.input} type='date' ref={dateRef} />
            <button style={inputStyles.button} onClick={submit}>
              Update Author
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Authors
