import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()

    const content = event.target.content.value
    event.target.content.value = ''
    dispatch(createAnecdote(content))
    dispatch(setNotification(`'${content}' added`, 10))
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
