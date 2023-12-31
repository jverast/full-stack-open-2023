import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

import { useDispatch, useSelector } from 'react-redux'
import { createNotification } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const info = useSelector((state) => state.notification)

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

  const login = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      dispatch(
        createNotification({
          message: error.response.data.error,
          type: 'error'
        })
      )
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
      dispatch(
        createNotification({
          message: `a new blog ${blogReturned.title} added`
        })
      )
    } catch (error) {
      dispatch(
        createNotification({
          message: error.response.data.error,
          type: 'error'
        })
      )
    }
  }

  const incrementLikes = async (updatedBlog, id) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog, id)
      setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
    } catch (error) {
      dispatch(
        createNotification({
          message: error.response.data.error,
          type: 'error'
        })
      )
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
        dispatch(
          createNotification({
            message: error.response.data.error,
            type: 'error'
          })
        )
      }
    }
  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification info={info} />
        <LoginForm login={login} />
      </div>
    )
  }

  const sortBlogs = () => blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div className="blogs">
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
