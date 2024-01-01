import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { createNotification } from './notificationReducer'

const initialState = []
const slice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    addLikeToBlog(state, action) {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog
      )
    },
    dropBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
    appendComment(state, action) {
      const blogToUpdate = state.find((blog) => blog.id === action.payload.id)
      const updatedBlog = {
        ...blogToUpdate,
        comments: blogToUpdate.comments.concat(action.payload.comment)
      }
      return state.map((blog) =>
        blog.id === action.payload.id ? updatedBlog : blog
      )
    }
  }
})

export const { setBlogs, appendBlog, addLikeToBlog, appendComment, dropBlog } =
  slice.actions

export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog, { name, username, id }) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      newBlog.user = { name, username, id }
      dispatch(appendBlog(newBlog))
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
}

export const updateBlogLikes = (blog) => {
  return async (dispatch) => {
    try {
      const blogToUpdate = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }
      const updatedBlog = await blogService.update(blogToUpdate, blog.id)
      updatedBlog.user = blog.user
      dispatch(addLikeToBlog(updatedBlog))
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

export const deleteBlog = (id, navigate) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(dropBlog(id))
      navigate('/')
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

export const createComment = (id, comment) => {
  return async (dispatch) => {
    try {
      await blogService.addComment(id, comment)
      dispatch(appendComment({ id, comment }))
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

export default slice.reducer
