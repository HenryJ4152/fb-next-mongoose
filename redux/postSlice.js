import { createSlice } from '@reduxjs/toolkit'

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    creatingPost: false, //!!! creatingPost determine EditPostModal is open/closed
    editingPost: null, //!!! editingPost determine EditPostModal is open/closed
    // editingPost: {
    //   postId, author, text
    // }
    deletePostId: null, //!!! deletePostId determine DeletePostPopup is open/closed
    deletedPosts: [],
  },
  reducers: {
    setCreatingPost: (state, action) => {
      //!!! editingPost determine EditPostModal is open/closed
      if (action.payload) {
        state.creatingPost = action.payload
      } else {
        state.creatingPost = !state.creatingPost
      }
    },
    setEditingPost: (state, action) => {
      //!!! editingPost determine EditPostModal is open/closed
      state.editingPost = action.payload
    },
    setDeletePostId: (state, action) => {
      //!!! deletePostId determine DeletePostPopup is open/closed
      state.deletePostId = action.payload
    },
    addDeletedPosts: (state, action) => {
      state.deletedPosts = [...state.deletedPosts, action.payload]
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCreatingPost, setEditingPost, setDeletePostId, addDeletedPosts } = postSlice.actions

export default postSlice.reducer