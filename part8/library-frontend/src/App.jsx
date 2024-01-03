import { Link, Route, Routes } from 'react-router-dom'
import Books from './components/Books'
import Authors from './components/Authors'

const App = () => {
  return (
    <>
      <div style={{ display: 'flex', gap: 5 }}>
        <Link to="/">authors</Link>
        <Link to="/books">books</Link>
      </div>
      <Routes>
        <Route path="/books" element={<Books />} />
        <Route path="/" element={<Authors />} />
      </Routes>
    </>
  )
}

export default App
