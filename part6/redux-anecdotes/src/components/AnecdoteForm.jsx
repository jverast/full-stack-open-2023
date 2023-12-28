import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setMessage, removeMessage } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()

    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(createAnecdote(content))
    dispatch(setMessage(`'${content}' added`))
    setTimeout(() => {
      dispatch(removeMessage())
    }, 5000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input type="text" name="content" />
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm
