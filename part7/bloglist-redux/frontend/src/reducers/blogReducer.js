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
    }
  }
})

export const { setBlogs, appendBlog, addLikeToBlog, dropBlog } = slice.actions

export const fetchBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
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

export const updateBlogLikes = (blog, id) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.update(blog, id)
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

export const deleteBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(dropBlog(id))
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
