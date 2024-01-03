import { useState } from 'react'
import { UPDATE_AUTHOR_BIRTH, ALL_AUTHORS } from '../queries'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import AuthorPicker from './AuthorPicker'

const AuthorBirthForm = () => {
  const [born, setBorn] = useState('')
  const navigate = useNavigate()

  const result = useQuery(ALL_AUTHORS)
  const [updateAuthorBirth] = useMutation(UPDATE_AUTHOR_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: () => {
      navigate('/')
    }
  })

  const submit = (event) => {
    event.preventDefault()
    updateAuthorBirth({
      variables: {
        name: event.target.author.value,
        born: Number(born) || undefined
      }
    })
  }

  if (result.loading) {
    return null
  }

  const authors = result.data.allAuthors

  return (
    <>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <AuthorPicker authors={authors} />
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </>
  )
}

export default AuthorBirthForm
