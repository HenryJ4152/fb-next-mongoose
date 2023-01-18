import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    open: false,
    messagingUser: null,
  },
  reducers: {
    toggleOpen: (state, action) => {
      state.open = !state.open
    },
    setMessagingUser: (state, action) => {
      // console.log(action.payload)
      state.messagingUser = action.payload
      state.open = true
    }
  },
})



// Action creators are generated for each case reducer function
export const { toggleOpen, setMessagingUser } = messageSlice.actions

export default messageSlice.reducer