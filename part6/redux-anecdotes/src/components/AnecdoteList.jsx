import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdotesReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch(),
    anecdotes = useSelector(({ anecdotes, filter }) => {
      const anecdotesSorted = anecdotes.sort((a, b) => b.votes - a.votes)
      if (!filter) {
        return anecdotesSorted
      }
      return anecdotesSorted.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    })

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(voteAnecdote(anecdote.id))}>
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
