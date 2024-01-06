import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Books from './components/Books'
import Authors from './components/Authors'
import NewBook from './components/NewBook'
import AuthorBirthForm from './components/AuthorBirthForm'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'
import FavoriteGenres from './components/FavoriteGenres'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/login')
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      setTimeout(() => {
        alert(`'${addedBook.title}' added`)
      }, 5000)
    }
  })

  return (
    <>
      <div style={{ display: 'flex', gap: 6 }}>
        <Link to="/">authors</Link>
        <Link to="/books">books</Link>
        {!token ? (
          <Link to="/login">
            <button type="button">login</button>
          </Link>
        ) : (
          <>
            <Link to="/add-book">add book</Link>
            <Link to="/update-author">udpate author</Link>
            <Link to="/recommend">recommend</Link>
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/recommend" element={token && <FavoriteGenres />} />
        <Route
          path="/login"
          element={
            !token ? <LoginForm setToken={setToken} /> : <Navigate to="/" />
          }
        />
        <Route path="/add-book" element={token && <NewBook />} />
        <Route path="/update-author" element={token && <AuthorBirthForm />} />
        <Route path="/" element={<Authors />} />
      </Routes>
    </>
  )
}

export default App
