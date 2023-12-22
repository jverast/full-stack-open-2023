import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [info, setInfo] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setInfo({ message: error.response.data.error, type: 'error' })
      setTimeout(() => {
        setInfo(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('loggedNoteappUser')
  }

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogReturned = await blogService.create({ title, author, url })
      setBlogs([...blogs, blogReturned])

      setTitle('')
      setAuthor('')
      setUrl('')

      setInfo({ message: `a new blog ${blogReturned.title} added` })
      setTimeout(() => {
        setInfo(null)
      }, 5000)
    } catch (error) {
      setInfo({ message: error.response.data.error, type: 'error' })
      setTimeout(() => {
        setInfo(null)
      }, 5000)
    }
  }

  if (!user) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification info={info} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <div>
            <button type="submit">login</button>
          </div>
        </form>
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>
        {user.name} is logged in{' '}
        <button type="button" onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable labelButton="new note">
        <h2>create new</h2>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              type="text"
              name="title"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              type="text"
              name="author"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type="text"
              name="url"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <div>
            <button type="submit">create</button>
          </div>
        </form>
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
