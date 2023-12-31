import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { createNotification } from './notificationReducer'

const initialState = null
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserSession(state, action) {
      return action.payload
    },
    removeUserSession(state, action) {
      localStorage.removeItem('loggedNoteappUser')
      return initialState
    }
  }
})

export const { setUserSession, removeUserSession } = slice.actions

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUserSession(user))
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
