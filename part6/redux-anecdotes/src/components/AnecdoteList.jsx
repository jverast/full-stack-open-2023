import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setMessage, removeMessage } from '../reducers/notificationReducer'

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
    dispatch(voteAnecdote(id))
    dispatch(setMessage(`you voted '${content}'`))
    setTimeout(() => {
      dispatch(removeMessage())
    }, 5000)
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
