import { useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

import { useDispatch, useSelector } from 'react-redux'
import {
  fetchBlogs,
  createBlog,
  updateBlogLikes,
  deleteBlog
} from './reducers/blogReducer'
import {
  loginUser,
  removeUserSession,
  setUserSession
} from './reducers/userSessionReducer'
import { Route, Routes } from 'react-router-dom'
import Users from './components/Users'
import { fetchUsers } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)
  const userSession = useSelector((state) => state.userSession)
  const info = useSelector((state) => state.notification)

  useEffect(() => {
    dispatch(fetchBlogs())
    dispatch(fetchUsers())
  }, [])

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUserSession(user))
      blogService.setToken(user.token)
    }
  }, [])

  const login = async (username, password) => {
    dispatch(loginUser(username, password))
  }

  const handleLogout = () => {
    dispatch(removeUserSession())
  }

  const addBlog = async (blog) => {
    dispatch(createBlog(blog))
  }

  const updateBlog = async (blog, id) => {
    dispatch(updateBlogLikes(blog, id))
  }

  const removeBlog = async (blog) => {
    const isConfirm = confirm(`remove blog ${blog.title}`)
    if (isConfirm) {
      dispatch(deleteBlog(blog.id))
    }
  }

  if (!userSession) {
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
      <p>{userSession.name} is logged in </p>
      <button type="button" onClick={handleLogout} className="logout">
        logout
      </button>
      <Routes>
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/"
          element={
            <>
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
                  userSession={userSession}
                />
              ))}
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
