import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userSessionReducer from './reducers/userSessionReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    notification: notificationReducer,
    userSession: userSessionReducer,
    users: userReducer
  }
})

export default store
