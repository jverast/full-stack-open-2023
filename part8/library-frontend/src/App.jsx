import { Link, Route, Routes } from 'react-router-dom'
import Books from './components/Books'
import Authors from './components/Authors'
import NewBook from './components/NewBook'

const App = () => {
  return (
    <>
      <div style={{ display: 'flex', gap: 5 }}>
        <Link to="/">authors</Link>
        <Link to="/books">books</Link>
        <Link to="/add-book">add book</Link>
      </div>
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<NewBook />} />
        <Route path="/" element={<Authors />} />
      </Routes>
    </>
  )
}

export default App
