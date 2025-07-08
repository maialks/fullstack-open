import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Authors from './components/Authors'
import Books from './components/Books'
BookForm
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import BookForm from './components/BookForm.jsx'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/authors' element={<Authors />} />
          <Route path='/books' element={<Books />} />
          <Route path='/add' element={<BookForm />} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
)
