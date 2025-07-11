import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Authors from './components/Authors'
import Books from './components/Books'
import BookForm from './components/BookForm.jsx'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('booksapp-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/authors' element={<Authors />} />
            <Route path='/books' element={<Books />} />
            <Route path='/add' element={<BookForm />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
)
