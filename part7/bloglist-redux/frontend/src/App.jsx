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
import { Link, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import { fetchUsers } from './reducers/userReducer'
import User from './components/User'
import BlogDetails from './components/BlogDetails'

const App = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const match = useMatch('/users/:id')
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
    dispatch(createBlog(blog, userSession))
  }

  const updateBlog = async (blog) => {
    dispatch(updateBlogLikes(blog))
  }

  const removeBlog = async (blog) => {
    const isConfirm = confirm(`remove blog ${blog.title}`)
    if (isConfirm) {
      dispatch(deleteBlog(blog.id, navigate))
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

  const user =
    users && match ? users.find((user) => user.id === match.params.id) : null

  const style = {
    backgroundColor: 'rgb(0, 0, 0, .15)',
    display: 'flex',
    columnGap: 7,
    padding: 5
  }

  return (
    <div className="blogs">
      <div style={style}>
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
        <span>{userSession.name} is logged in </span>
        <button type="button" onClick={handleLogout} className="logout">
          logout
        </button>
      </div>
      <Notification info={info} />
      <h2>blog app</h2>
      <Routes>
        <Route path="/users/:id" element={<User user={user} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails updateBlog={updateBlog} removeBlog={removeBlog} />
          }
        />
        <Route
          path="/"
          element={
            <>
              <Togglable labelButton="create new blog">
                <h2>create new</h2>
                <BlogForm createBlog={addBlog} />
              </Togglable>
              {sortBlogs().map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
