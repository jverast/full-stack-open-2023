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

import { Button, Card, Container } from 'react-bootstrap'

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
      <div
        className="vh-100 d-flex flex-column justify-content-center mx-auto"
        style={{ width: 600 }}
      >
        <Notification info={info} />
        <Card className="w-100">
          <Card.Header>
            <Card.Title className="my-1">log in to application</Card.Title>
          </Card.Header>
          <LoginForm login={login} />
        </Card>
      </div>
    )
  }

  const sortBlogs = () => {
    return Object.assign([], blogs).sort((a, b) => b.likes - a.likes)
  }

  const user =
    users && match ? users.find((user) => user.id === match.params.id) : null

  return (
    <div className="blogs" style={{ minWidth: 430 }}>
      <nav className="mb-3 p-2 d-flex justify-content-center bg-secondary-subtle">
        <div
          className="w-100 d-flex justify-content-between"
          style={{ maxWidth: 1024 }}
        >
          <div>
            <h2 className="m-1">blog app</h2>
          </div>
          <div className="col d-flex gap-2 align-items-center col-sm-9 justify-content-end">
            <Link to="/" className="link-underline link-underline-opacity-0">
              blogs
            </Link>
            <Link
              to="/users"
              className="link-underline link-underline-opacity-0"
            >
              users
            </Link>
            <span style={{ fontSize: '.8rem', position: 'relative', top: 0 }}>
              <strong>{userSession.name}</strong> is logged in{' '}
            </span>
            <Button
              type="button"
              onClick={handleLogout}
              className="logout"
              size="sm"
              variant="danger"
            >
              logout
            </Button>
          </div>
        </div>
      </nav>
      <Container style={{ maxWidth: 1024 }}>
        <Notification info={info} />
        <div>
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
                    <h2>create new blog</h2>
                    <BlogForm createBlog={addBlog} />
                  </Togglable>
                  <div className="d-flex flex-column row-gap-1">
                    {sortBlogs().map((blog) => (
                      <Blog key={blog.id} blog={blog} />
                    ))}
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </Container>
    </div>
  )
}

export default App
