import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createAnecdote = async (newAnecdote) => {
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

const voteForAnecdote = async (updatedAnecdote) => {
  const response = await axios.put(
    `${baseUrl}/${updatedAnecdote.id}`,
    updatedAnecdote
  )
  return response.data
}

export { getAll, createAnecdote, voteForAnecdote }
