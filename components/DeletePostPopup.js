import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react"
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { addDeletedPosts, setDeletePostId, setEditingPost } from "../redux/postSlice";
import { fetchDeletePost } from "../utils/helpers";

function DeletePostPopup({ optionsRef, postId, author, text }) {
  //optionsRef refers to the button clicked that opens DeletePostPopup

  const { data: session } = useSession()

  const popUpRef = useRef()
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation((postId) => fetchDeletePost(postId), {
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries('posts')
      dispatch(addDeletedPosts(postId))

    },
  })

  useEffect(() => {
    function handleClickOutside(event) {
      if (popUpRef.current && !popUpRef.current.contains(event.target) && !optionsRef.current.contains(event.target)) {
        dispatch(setDeletePostId(null))
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popUpRef]);

  const deleteClicked = async () => {
    console.log('deleting ', postId)
    deleteMutation.mutate(postId)

  }

  const editClicked = () => {
    dispatch(setEditingPost({ postId, author, text }))
    dispatch(setDeletePostId(null))
  }


  return (
    <div ref={popUpRef} className='flex flex-col w-32 absolute right-0 top-6 bg-stone-700 rounded-md py-1 px-2  shadow-2xl whitespace-nowrap '>


      {session && session?.user?.id.substring(0, 17) === author.id &&
        <>
          <div onClick={editClicked} className=' flex items-center space-x-2 shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none'>
            Edit Post
          </div>
          <div onClick={deleteClicked} className=' flex items-center space-x-2 shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none'>
            Delete Post
          </div>
        </>
      }
      {session && session?.user?.id.substring(0, 17) !== author.id &&
        <div className=' flex items-center space-x-2 shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600  justify-center my-1 text-sm select-none'>
          Options
        </div>
      }


      {!session && author.id === "000" &&
        <>
          <div onClick={editClicked} className=' flex items-center space-x-2 shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none'>
            Edit Post
          </div>
          <div onClick={deleteClicked} className=' flex items-center space-x-2 shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600 cursor-pointer justify-center my-1 text-sm select-none'>
            Delete Post
          </div>
        </>
      }


      {!session && author.id !== "000" &&
        <div className=' flex items-center space-x-2 shadow-2xl p-1 py-2 rounded-lg hover:bg-stone-600  justify-center my-1 text-sm select-none'>
          Options
        </div>
      }




    </div>
  )
}

export default DeletePostPopup