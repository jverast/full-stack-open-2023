import { configureStore } from '@reduxjs/toolkit'
import anecdotesReducer from './src/reducers/anecdotesReducer'
import filterReducer from './src/reducers/filterReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdotesReducer,
    filter: filterReducer
  }
})

export default store
