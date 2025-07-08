import Navbar from './Navbar'
import { GET_BOOKS } from '../queries'
import { useQuery } from '@apollo/client'
import LoadingSpinner from './LoadingSpinner'

const TableStyles = {
  container: {
    marginLeft: 15,
    color: '#e0e0e0',
    backgroundColor: '#121212',
    minHeight: '100vh',
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
  const res = useQuery(GET_BOOKS)

  if (res.loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }

  console.log(res)

  const books = res.data.allBooks

  return (
    <div>
      <Navbar />
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
                <td style={TableStyles.thtd}>{b.author}</td>
                <td style={TableStyles.thtd}>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Books
