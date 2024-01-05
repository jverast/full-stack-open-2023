import { useQuery } from '@apollo/client'
import { USER, ALL_BOOKS } from '../queries'

const FavoriteGenres = () => {
  const resultUser = useQuery(USER)
  const resultBooks = useQuery(ALL_BOOKS)

  if (resultUser.loading || resultBooks.loading) {
    return (
      <div>
        <h2>Reccommendations</h2>
        <p>loading...</p>
      </div>
    )
  }

  const user = resultUser.data.me
  const favorites =
    resultBooks.data &&
    resultBooks.data.allBooks.filter((book) =>
      book.genres.includes(user.favoriteGenre)
    )

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        books in your favorite genre <strong>{user.favoriteGenre}</strong>
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        {
          <tbody>
            {favorites &&
              favorites.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
                </tr>
              ))}
          </tbody>
        }
      </table>
    </div>
  )
}

export default FavoriteGenres
