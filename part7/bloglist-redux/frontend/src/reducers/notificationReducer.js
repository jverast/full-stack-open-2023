import { createSlice } from '@reduxjs/toolkit'

const initialState = null
const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return initialState
    }
  }
})

export const { setNotification, removeNotification } = slice.actions

export const createNotification = (notification) => {
  return async (dispatch) => {
    dispatch(setNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }
}

export default slice.reducer
