import CloseIcon from '@mui/icons-material/Close';
import { Avatar, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setEditingPost } from '../redux/postSlice';
import { fetchUpdatePost } from '../utils/helpers';

function EditPostModal() {
  const editingPost = useSelector((state) => state.postReducer.editingPost)
  // console.log("editingPost", editingPost)
  const name = editingPost.author.name
  const profileImage = editingPost.author.profilePic
  const postId = editingPost.postId
  const postText = editingPost.text

  const dispatch = useDispatch()
  const modalRef = useRef()
  const [expandModal, setExpandModal] = useState(false)
  const textAreaRef = useRef()

  const [textAreaText, setTextAreaText] = useState(postText)
  const [textChanged, setTextChanged] = useState(false)

  const handleClose = () => {
    dispatch(setEditingPost(null))
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(setEditingPost(null))
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  useEffect(() => {
    if (textAreaText !== postText) {
      setTextChanged(true)
      // console.log(textAreaText);
    } else {
      setTextChanged(false)
      // console.log("text unchanged")
    }

    if (textAreaText.length > 270) {
      setExpandModal(true)
    } else {
      setExpandModal(false)
    }

  }, [textAreaText])

  const queryClient = useQueryClient()

  const updateMutation = useMutation(([postId, textAreaText]) => fetchUpdatePost(postId, textAreaText), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
      dispatch(setEditingPost(null))
    },
  })

  const handleSave = (e) => {
    e.preventDefault()
    // console.log(postText)
    // console.log(textRef.current.value)
    if (textChanged) {
      updateMutation.mutate([postId, textAreaText, null])
      // fetchUpdatePost(postId, textAreaText)
    }
  }


  return (
    <div className=' fixed w-full h-full z-50 bg-black bg-opacity-70 flex items-center justify-center'>

      <div ref={modalRef} className={`modal flex flex-col bg-stone-800 w-[40vw] ${expandModal ? "h-[70vh]" : "h-[50vh]"}  opacity-100 px-3 rounded-md relative`}>
        {/* first row */}
        <div className=' flex items-center justify-center relative'>
          <p className=' text-white mt-3 text-lg'>Edit Post</p>
          <IconButton onClick={handleClose} className=' absolute right-0 top-3 bg-stone-600 hover:bg-stone-500 cursor-pointer w-8 h-8'>
            <CloseIcon />
          </IconButton>
        </div>
        {/* post itself */}
        <div className=' flex items-center mb-3 space-x-2'>
          <Avatar src={profileImage} />
          <p>{name}</p>
        </div>

        <form className=' flex-1 flex flex-col'>
          <textarea
            ref={textAreaRef}
            className=' w-full  outline-none mb-3 resize-none   pr-3  
            flex-1 scrollbar-thin scrollbar-thumb-stone-300 '
            name="postText" id="postText" cols="30"
            value={textAreaText}
            onChange={e => setTextAreaText(e.target.value)}
          // defaultValue={postText}
          >
          </textarea>

          <button
            onClick={(e) => handleSave(e)}
            className={`w-full bg-stone-600 rounded-md py-1 mb-3 ${textChanged ? 'hover:bg-blue-500' : 'hover:bg-stone-600 cursor-default'}`}
          >
            Save
          </button>
        </form>

      </div>
    </div>
  )
}

export default EditPostModal