import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const initialState = null
const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    }
  }
})

export const { setUsers } = slice.actions

export const fetchUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }
}

export default slice.reducer
