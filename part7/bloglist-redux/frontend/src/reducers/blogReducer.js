import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

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
    const newBlog = await blogService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const updateBlogLikes = (blog, id) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(blog, id)
    dispatch(addLikeToBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(dropBlog(id))
  }
}

export default slice.reducer
