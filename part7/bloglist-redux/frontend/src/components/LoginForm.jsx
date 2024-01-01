import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    login(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <Form onSubmit={handleLogin} className="d-flex flex-column gap-2 p-2">
        <Form.Group>
          <Form.Label visuallyHidden>username</Form.Label>
          <Form.Control
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            placeholder="username"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label visuallyHidden>password</Form.Label>
          <Form.Control
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="password"
          />
        </Form.Group>
        <Form.Group className="text-center">
          <Button id="login-button" type="submit" className="px-5">
            login
          </Button>
        </Form.Group>
      </Form>
    </>
  )
}

export default LoginForm
