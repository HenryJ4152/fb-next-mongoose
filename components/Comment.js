import { Avatar, IconButton } from "@mui/material"
import { useSession } from "next-auth/react"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useRef, useState } from "react";
import { fetchUpdateAComment, fetchUpdatePostComments } from "../utils/helpers";
import { useMutation, useQuery, useQueryClient } from "react-query";


function Comment({ postId, comment }) {

  const commentId = comment._id

  const { data: session } = useSession()
  const [showOptions, setShowOptions] = useState(false)
  const [editing, setEditing] = useState(false)

  const showOptionsRef = useRef()
  const handleDeleteRef = useRef()


  const queryClient = useQueryClient()

  // press options
  const handleOptions = () => {
    setShowOptions(!showOptions)
  }

  //handling click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (handleDeleteRef.current && !handleDeleteRef.current.contains(event.target) && !showOptionsRef.current.contains(event.target)) {
        setShowOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleDeleteRef]);
  //


  // press Edit to start editing
  const handleEdit = (e) => {
    console.log("edit");
    e.stopPropagation()
    setShowOptions(false)
    setEditing(true)

    setTimeout(() => {
      editTextAreaRef?.current?.focus();
      var val = editTextAreaRef.current.value; //store the value of the element
      editTextAreaRef.current.value = ''; //clear the value of the element
      editTextAreaRef.current.value = val; //set that value back.  

    }, 100);
  }
  //


  const [commentInput, setCommentInput] = useState(comment.comment)//try see work if default is comment
  const editFormRef = useRef()
  const editTextAreaRef = useRef()


  // submit changes to comment
  const updateMutation = useMutation(([postId, comment, commentId, addDeleteUpdate]) => fetchUpdateAComment(postId, comment, commentId, addDeleteUpdate), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
      setEditing(false)
    },
  })

  useEffect(() => {
    if (editing) {

      //changes height of the text area
      editTextAreaRef.current.style.height = "0px"

      let scrollHeight = editTextAreaRef.current.scrollHeight;
      if (scrollHeight >= 555) {
        scrollHeight = 555
      }
      editTextAreaRef.current.style.height = scrollHeight + "px";
      editFormRef.current.style.height = scrollHeight + "px";

    }

  }, [commentInput, editing])


  const onEnterEscPress = (e) => {
    // !!! pressing Enter in textarea does not submit form so need this fxn
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSubmitEdit(e);
    }
    if (e.keyCode === 27 && editing == true) {
      setEditing(false)
      setCommentInput(comment.comment)
    }

  }

  const handleSubmitEdit = (e) => {
    e.preventDefault()

    if (comment.comment == editTextAreaRef.current.value.trim()) {
      setEditing(false)
    } else {
      postId
      const newComment = {
        ...comment,
        comment: editTextAreaRef.current.value.trim()
      }
      const addDeleteUpdate = "UPDATE"
      // console.log(postId);
      // console.log(commentId)
      // console.log(newComment);
      // console.log(addDeleteUpdate)
      updateMutation.mutate([postId, newComment, commentId, addDeleteUpdate])
    }
  }
  //


  // press delete
  const deleteMutation = useMutation(([postId, comment, addDeleteUpdate]) => fetchUpdatePostComments(postId, comment, addDeleteUpdate), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
    },
  })


  const handleDelete = (e) => {
    console.log("delete");
    e.stopPropagation();
    setShowOptions(false)

    const addDeleteUpdate = "DELETE"
    deleteMutation.mutate([postId, comment, addDeleteUpdate])
  }
  //

  const [seeFullComment, setSeeFullComment] = useState(false)
  function split(string) {
    for (let i = 222; i >= 0; i--) {
      if (string.charAt(i) == " ") {
        return string.slice(0, i);
      }
    }
  }

  return (
    <div className=" flex px-2 space-x-2 py-1">
      {comment.profilePic ? (
        <Avatar src={comment.profilePic} className=" w-7 h-7" />
      ) : (
        <Avatar className=" w-7 h-7">J</Avatar>
      )}
      <div className={`flex flex-col ${editing && "w-full"}`}>
        <div className=" flex items-center space-x-1 w-full flex-1">

          <div className={` bg-stone-600 rounded-xl flex flex-col px-3 py-1 pt-0.5 w-full  flex-1 ${editing && "pb-0 -mb-0.5"}`}>
            <p className=" text-sm font-bold">{comment.name || ""}</p>
            {editing ? (
              <form
                ref={editFormRef}
                className=" w-full flex-1 rounded-xl m-0 p-0 inline"
                onKeyDown={onEnterEscPress}

              >
                <textarea
                  ref={editTextAreaRef}
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  className=" w-full flex-1 outline-none resize-none text-sm pb-0 inset-0 break-all scrollbar-thin scrollbar-thumb-slate-200 pr-2"
                  type="text">
                </textarea>
              </form>
            ) : (
              <>
                {comment.comment.length < 240 ? (
                  <p className=" text-sm break-all">{comment.comment}</p>
                ) : !seeFullComment ? (
                  <p className=" text-sm break-all">
                    {comment.comment.slice(0, 240) + "... "}
                    <span onClick={() => setSeeFullComment(true)} className=" hover:underline cursor-pointer font-bold">See more</span>
                  </p>
                ) : (
                  <p className=" text-sm break-all">
                    {comment.comment}
                  </p>
                )}
              </>
            )}
          </div>

          {!editing &&
            <div className=" relative">

              <IconButton ref={showOptionsRef} onClick={handleOptions} disableRipple className={`bg-stone-600 h-5 w-5 p-3 ${showOptions ? "opactiy-100" : "opacity-0"}  hover:opacity-100  active:transform active:transition ease-in-out active:scale-110 `}>
                <MoreHorizIcon className="" />
              </IconButton>

              {/* EditComment - refractor out */}
              {showOptions && session && session?.user?.id.substring(0, 17) === comment.commentorId &&
                <div ref={handleDeleteRef} className='flex flex-col w-24 absolute -left-9 top-7 bg-stone-700 rounded-md py-1 px-1  shadow-2xl whitespace-nowrap z-50'>
                  <div onClick={handleEdit} className=' flex items-center  shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none' >
                    Edit
                  </div>
                  <div onClick={handleDelete} className=' flex items-center  shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none'>
                    Delete
                  </div>
                </div>
              }
              {showOptions && !session && comment.commentorId === "000" &&
                <div ref={handleDeleteRef} className='flex flex-col w-24 absolute -left-9 top-7 bg-stone-700 rounded-md py-1 px-1  shadow-2xl whitespace-nowrap z-50'>
                  <div onClick={handleEdit} className=' flex items-center  shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none' >
                    Edit
                  </div>
                  <div onClick={handleDelete} className=' flex items-center  shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none'>
                    Delete
                  </div>
                </div>
              }
              {showOptions && session && session?.user?.id.substring(0, 17) !== comment.commentorId &&
                <div ref={handleDeleteRef} className='flex flex-col w-24 absolute -left-9 top-7 bg-stone-700 rounded-md py-1 px-1  shadow-2xl whitespace-nowrap z-50'>
                  <div className=' flex items-center  shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600  justify-center my-1 text-sm select-none' >
                    Options
                  </div>
                </div>
              }
              {showOptions && !session && comment.commentorId !== "000" &&
                <div ref={handleDeleteRef} className='flex flex-col w-24 absolute -left-9 top-7 bg-stone-700 rounded-md py-1 px-1  shadow-2xl whitespace-nowrap z-50'>
                  <div className=' flex items-center  shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600  justify-center my-1 text-sm select-none' >
                    Options
                  </div>
                </div>
              }

            </div>
          }



        </div>
        {session &&
          <div className=" flex text-xs space-x-2 px-2">
            {editing ? (
              <p className=" cursor-default">Press Esc to cancel</p>
            ) : (
              <>
                <p className=" cursor-default">Like</p>
                <p className=" cursor-default">Reply</p>
                <p className=" cursor-default">Share</p>
                <p className=" cursor-default pr-7">Recent</p>
              </>
            )}
          </div>
        }
      </div>
    </div >
  )
}

export default Comment