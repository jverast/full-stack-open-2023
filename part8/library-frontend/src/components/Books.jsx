import { useQuery } from '@apollo/client'
import { ALL_BOOKS, FILTER_ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const [genre, setGenre] = useState('')
  const resultAllBooks = useQuery(ALL_BOOKS)
  const resultFilterAllBooks = useQuery(FILTER_ALL_BOOKS, {
    variables: { genre }
  })

  if (resultFilterAllBooks.loading) {
    return (
      <div>
        <h2>books</h2>
        <p>loading...</p>
      </div>
    )
  }

  const books = resultFilterAllBooks.data.allBooks ?? []
  const Allgenres = [
    ...new Set(resultAllBooks.data.allBooks.map((book) => book.genres).flat())
  ]

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genre || 'all genres'}</strong>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Allgenres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
