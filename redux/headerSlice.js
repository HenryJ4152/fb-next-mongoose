import { createSlice } from '@reduxjs/toolkit'

export const headerSlice = createSlice({
  name: 'header',
  initialState: {
    open: false, //signInPopup
  },
  reducers: {
    toggleSignInPopup: (state, action) => {
      state.open = !state.open
    },
    closeSignInPopup: (state, action) => {
      state.open = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleSignInPopup, closeSignInPopup } = headerSlice.actions

export default headerSlice.reducer