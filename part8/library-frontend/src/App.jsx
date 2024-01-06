import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Books from './components/Books'
import Authors from './components/Authors'
import NewBook from './components/NewBook'
import AuthorBirthForm from './components/AuthorBirthForm'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'
import FavoriteGenres from './components/FavoriteGenres'
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import Notify from './components/Notify'

const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same book twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState(null)

  const client = useApolloClient()
  const navigate = useNavigate()

  const showMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/login')
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      showMessage(`'${addedBook.title}' added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
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
      <Notify message={message} />
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
