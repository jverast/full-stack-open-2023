import { configureStore } from '@reduxjs/toolkit'
import anecdotesReducer from './src/reducers/anecdoteReducer'
import filterReducer from './src/reducers/filterReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdotesReducer,
    filter: filterReducer
  }
})

export default store
