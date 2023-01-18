import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './messageSlice'
import headerReducer from './headerSlice'
import postReducer from './postSlice'

export default configureStore({
  reducer: {
    messageReducer,
    headerReducer,
    postReducer,
  },
})
