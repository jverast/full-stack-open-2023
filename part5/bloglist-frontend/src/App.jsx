import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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

  const addBlog = async (newBlog) => {
    try {
      const blogReturned = await blogService.create(newBlog)
      setBlogs([...blogs, blogReturned])

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

  const incrementLikes = async (updatedBlog, id) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog, id)
      setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    const isConfirm = confirm(`remove blog ${blogToDelete.title}`)
    if (isConfirm) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
      } catch (error) {
        setInfo({ message: error.response.data.error, type: 'error' })
        setTimeout(() => {
          setInfo(null)
        }, 5000)
      }
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
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <div>
            <button id="login-button" type="submit">
              login
            </button>
          </div>
        </form>
      </>
    )
  }

  const sortBlogs = () => blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>
        {user.name} is logged in{' '}
        <button type="button" onClick={handleLogout} className="logout">
          logout
        </button>
      </p>
      <Togglable labelButton="create new blog">
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {sortBlogs().map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={incrementLikes}
          removeBlog={deleteBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
