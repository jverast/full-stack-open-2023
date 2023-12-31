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
import {
  fetchBlogs,
  createBlog,
  updateBlogLikes,
  deleteBlog
} from './reducers/blogReducer'
import { loginUser, removeUser, setUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const info = useSelector((state) => state.notification)
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (username, password) => {
    try {
      dispatch(loginUser(username, password))
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
    dispatch(removeUser())
    localStorage.removeItem('loggedNoteappUser')
  }

  const addBlog = async (blog) => {
    try {
      dispatch(createBlog(blog))
      dispatch(
        createNotification({
          message: `a new blog ${blog.title} added`
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

  const updateBlog = async (blog, id) => {
    try {
      dispatch(updateBlogLikes(blog, id))
    } catch (error) {
      dispatch(
        createNotification({
          message: error.response.data.error,
          type: 'error'
        })
      )
    }
  }

  const removeBlog = async (id) => {
    const { title } = blogs.find((blog) => blog.id === id)
    const isConfirm = confirm(`remove blog ${title}`)
    if (isConfirm) {
      try {
        dispatch(deleteBlog(id))
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

  const sortBlogs = () => {
    return Object.assign([], blogs).sort((a, b) => b.likes - a.likes)
  }

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
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
