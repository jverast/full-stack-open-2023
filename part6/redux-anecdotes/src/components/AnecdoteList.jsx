import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const getFilteredAndSortedAnecdotes = (anecdotes, filter) => {
  const anecdotesSorted = Object.assign([], anecdotes).sort(
    (a, b) => b.votes - a.votes
  )
  if (!filter) {
    return anecdotesSorted
  }
  return anecdotesSorted.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch(),
    anecdotesState = useSelector((state) => state.anecdotes),
    filterState = useSelector((state) => state.filter),
    anecdotes = getFilteredAndSortedAnecdotes(anecdotesState, filterState)

  const vote = (id, content) => {
    dispatch(updateAnecdote(id))
    dispatch(setNotification(`you voted '${content}'`, 10))
  }

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

export default AnecdoteList
