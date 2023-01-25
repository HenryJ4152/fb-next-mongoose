import { useSession } from 'next-auth/react'
import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import { setCreatingPost } from '../redux/postSlice'
import { fetchCreatePost } from '../utils/helpers'
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, IconButton } from '@mui/material';


function CreatePostModal() {
  const dispatch = useDispatch()
  const modalRef = useRef()
  const textAreaRef = useRef()
  const [textAreaText, setTextAreaText] = useState("")

  const { data: session } = useSession()
  const [guestUser, setGuestUser] = useState(false)

  const handleClose = () => {
    dispatch(setCreatingPost(false))
  }

  useEffect(() => {
    textAreaRef.current.focus()
  }, [])

  useEffect(() => {
    if (!session) {
      setGuestUser(true)
    } else {
      setGuestUser(false)
    }
  }, [session])


  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(setCreatingPost(false))
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
    //changes height of the text area 
    textAreaRef.current.style.height = "0px"

    let scrollHeight = textAreaRef.current.scrollHeight;
    if (scrollHeight >= 555) {
      scrollHeight = 555
    }
    textAreaRef.current.style.height = scrollHeight + "px";
    //depends on commentInput (when user starts typing)
  }, [textAreaText])




  const queryClient = useQueryClient()

  const createMutation = useMutation(([id, email, name, image, postText]) => fetchCreatePost(id, email, name, image, postText), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
      dispatch(setCreatingPost(false))
    },
  })

  const handleCreate = (e) => {
    e.preventDefault()
    // console.log(postText)
    // console.log(textRef.current.value)

    if (session) {
      createMutation.mutate([session.user.id, session.user.email, session.user.name, session.user.image, textAreaText])
    } else {
      createMutation.mutate(["000", "guestuser@guestmail.com", "Guest User", "", textAreaText])
    }
  }


  const [expandModal, setExpandModal] = useState(false)
  useEffect(() => {
    if (textAreaText.length > 270) {
      setExpandModal(true)
    } else {
      setExpandModal(false)
    }
  }, [textAreaText])



  return (
    <div className=' fixed w-full h-full z-50 bg-black bg-opacity-70 flex items-center justify-center'>

      <div ref={modalRef} className={`modal flex flex-col bg-stone-800 w-[40vw] ${expandModal ? "h-[70vh]" : "h-[50vh]"}  opacity-100 px-3 rounded-md relative`}>
        {/* first row */}
        <div className=' flex items-center justify-center relative'>
          <p className=' text-white mt-3 text-lg'>Create Post</p>
          <div onClick={handleClose} className='flex items-center justify-center absolute right-0 top-3 bg-stone-600 hover:bg-stone-500 cursor-pointer w-8 h-8 rounded-full '>
            <CloseIcon className=' scale-90' />
          </div>
        </div>
        {/* post itself */}
        {session ? (
          <div className=' flex items-center mb-3 space-x-2'>
            <Avatar src={session.user.image} />
            <p>{session.user.name}</p>
          </div>
        ) : (
          <div className=' flex items-center mb-3 space-x-2'>
            <Avatar></Avatar>
            <p>{"Guest User"}</p>
          </div>
        )}

        <form className=' flex-1 flex flex-col'>
          <textarea
            ref={textAreaRef}
            className=' w-full  outline-none mb-3 resize-none   pr-3  
             flex-1 scrollbar-thin scrollbar-thumb-stone-300 '
            name="postText" id="postText"
            value={textAreaText}
            onChange={e => setTextAreaText(e.target.value)}
            placeholder={"What's on your mind?"}
          >
          </textarea>

          <button
            onClick={(e) => handleCreate(e)}
            className={`w-full bg-stone-600 rounded-md py-1 mb-3 ${textAreaText ? 'hover:bg-blue-500' : 'hover:bg-stone-600 cursor-default'}`}
          >
            Post
          </button>
        </form>

      </div>
    </div>
  )
}

export default CreatePostModal