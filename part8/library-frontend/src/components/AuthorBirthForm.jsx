import { useState } from 'react'
import { UPDATE_AUTHOR_BIRTH, ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const AuthorBirthForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const navigate = useNavigate()

  const [updateAuthorBirth] = useMutation(UPDATE_AUTHOR_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: () => {
      navigate('/')
    }
  })

  const submit = (event) => {
    event.preventDefault()
    updateAuthorBirth({
      variables: { name: name || undefined, born: Number(born) || undefined }
    })
  }

  return (
    <>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
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
