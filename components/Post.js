import { Avatar } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Comment from "./Comment";
import { useSession } from "next-auth/react";
import DeletePostPopup from "./DeletePostPopup";
import { useDispatch, useSelector } from "react-redux";
import { setDeletePostId, toggleDeletePostId } from "../redux/postSlice";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { fetchUpdatePostComments, fetchUpdatePostLikes } from "../utils/helpers";

function Post({ postId, author, comments, likes, text }) {

  const { data: session } = useSession()

  const currentUserId = session?.user?.id || "000"

  const dispatch = useDispatch()
  const deletePostId = useSelector(state => state.postReducer.deletePostId)
  const deletedPosts = useSelector(state => state.postReducer.deletedPosts)

  if (deletedPosts.includes(postId)) {
    // console.log('deletedPosts.includes ', postId);
  }

  const optionsRef = useRef()

  const optionsClicked = () => {
    console.log(author)

    if (postId == deletePostId) {
      dispatch(setDeletePostId(null))
    } else {
      dispatch(setDeletePostId(postId))
    }
  }

  const [likedByUser, setLikedByUser] = useState(likes.includes(currentUserId) || false)

  const queryClient = useQueryClient()

  const updateMutation = useMutation(([postId, toggleLikeId, addFlag]) => fetchUpdatePostLikes(postId, toggleLikeId, addFlag), {
    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries('posts')
    },
  })



  const likeClicked = async () => {
    // console.log(session.user.id)

    if (likes?.includes(currentUserId)) {
      likes.splice(likes.indexOf(currentUserId), 1)
      // console.log(likes)
      // console.log(likes.includes(session.user.id))
      setLikedByUser(false)
      // remove from mongo
      updateMutation.mutate([postId, currentUserId, false])

    } else {
      likes.push(currentUserId)
      // console.log('add user id to likes', likes)
      // console.log(likes.includes(session.user.id))
      setLikedByUser(true)
      // add to mongo
      updateMutation.mutate([postId, currentUserId, true])
    }
  }

  // Commenting
  const [commentInput, setCommentInput] = useState("")
  const commentTextAreaRef = useRef()

  const commentMutation = useMutation(([postId, comment, addDeleteUpdate]) => fetchUpdatePostComments(postId, comment, addDeleteUpdate), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts')
      setCommentInput("")
      commentTextAreaRef.current.blur()
    },
  })


  useEffect(() => {
    if (commentTextAreaRef.current) {

      //changes height of the text area 
      commentTextAreaRef.current.style.height = "0px"

      let scrollHeight = commentTextAreaRef.current.scrollHeight;
      if (scrollHeight >= 555) {
        scrollHeight = 555
      }
      commentTextAreaRef.current.style.height = scrollHeight + "px";
      //depends on commentInput (when user starts typing)
    }
  }, [commentInput, commentTextAreaRef])


  const onEnterPress = (e) => {
    // !!! pressing Enter in textarea does not submit form so need this fxn
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSendComment(e);
    }
    if (e.keyCode === 27) {
      setCommentInput("")
      commentTextAreaRef.current.blur()
    }

  }

  const handleSendComment = async (e) => {
    e.preventDefault()
    postId
    const comment = {
      commentorId: session ? session.user.id : "000",
      name: session ? session.user.name : "Guest User",
      profilePic: session ? session.user.image : "",
      comment: commentInput,
    }
    console.log(comment)

    const addDeleteUpdate = "ADD"
    commentMutation.mutate([postId, comment, addDeleteUpdate])
  }


  return (
    <>
      {deletedPosts.includes(postId) ? (

        <div className="w-full flex justify-center px-3 py-3 bg-stone-800  mb-4 rounded-xl">
          Post deleted
        </div>
      ) : (

        <div className="w-full flex flex-col px-3 py-3 bg-stone-800  mb-4  rounded-xl">

          {/* head - img - name - ellipses horizontal icon - x icon */}
          <div className=" flex w-full items-center justify-between px-1 pt-1">
            <div className=" flex items-center space-x-2 ">
              {author?.profilePic ? (
                <Avatar className=" cursor-pointer" src={author?.profilePic} />
              ) :
                author.id === "000" ? (
                  <Avatar></Avatar>
                ) : (
                  <Avatar className=" cursor-pointer">{author?.name?.charAt(0) || ""}</Avatar>
                )
              }
              <p className=" cursor-pointer font-bold" >{author?.name || ""}</p>
            </div>
            <div className=" flex relative">
              <div ref={optionsRef} onClick={optionsClicked}>
                <div className="flex items-center justify-center rounded-full w-6 h-6 bg-transparent hover:bg-stone-500 cursor-pointer">
                  <MoreHorizIcon className="w-5 h-5 " />
                </div>
              </div>
              {deletePostId === postId &&
                <DeletePostPopup optionsRef={optionsRef} postId={postId} author={author} text={text} />
              }
            </div>
          </div>
          {/* post text */}
          <div className=" w-full px-2 py-3 break-all ">
            <p>{text || ""}</p>
          </div>
          {/* post img? */}
          {/* no likes   comments justify between */}
          <div className=" flex justify-between px-2 ">

            {/* show num likes */}
            {likes?.length > 0 ?
              (
                <div className=" flex items-center space-x-2 mr-auto">
                  <ThumbUpIcon className=" h-4 w-4 scale-75" />
                  <p>{likes.length || 0}</p>
                </div>
              ) : (
                <div className=" h-6"></div>
              )
            }
            {/* show num comments */}
            {comments.length > 0 &&
              <div className=" ml-auto">
                {comments?.length == 1 ? (
                  <p>{comments?.length} comment</p>
                ) : (
                  <p>{comments?.length} comments</p>
                )}
              </div>
            }

          </div>

          {/* icon like icon comment icon send */}
          < div className=" flex py-1  justify-around border-t border-b border-stone-500 my-2">

            <div
              onClick={likeClicked}
              className=" flex items-center justify-center space-x-2 cursor-pointer rounded-lg hover:bg-stone-500  flex-1 py-1">
              {likedByUser ? (
                <ThumbUpIcon className=" scale-75 " />
              ) : (
                <ThumbUpOutlinedIcon className=" scale-75 " />
              )}
              <p className=" select-none">Like</p>
            </div>
            <div className=" flex items-center justify-center space-x-2 flex-1 cursor-pointer rounded-lg hover:bg-stone-500">
              <ChatBubbleOutlineOutlinedIcon className=" scale-75 " />
              <p className=" select-none">Comment</p>
            </div>
            <div className=" flex items-center justify-center space-x-2 flex-1 cursor-pointer rounded-lg hover:bg-stone-500">
              <SendOutlinedIcon className=" scale-75 " />
              <p className=" select-none">Send</p>
            </div>

          </div>
          {/* write a comment */}
          <div className=" flex space-x-2 px-2 py-2">
            <Avatar className=" w-7 h-7" src={session?.user?.image} />
            <form className=" rounded-xl flex-1"
              // form listen for Enter key press bc enter does not submit text area unlike input
              onKeyDown={onEnterPress}
            >
              <textarea
                ref={commentTextAreaRef}
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                className=" w-full h-full rounded-xl flex-1 bg-stone-600 px-3 outline-none resize-none py-1 scrollbar-thin scrollbar-thumb-stone-200"
                type="text" placeholder="Write a comment..."
              >
              </textarea>
            </form>
          </div>


          {/* comments (img - text) */}
          {
            comments.map(comment => (
              <Comment className="flex" key={comment._id} postId={postId} comment={comment} />
            ))
          }

        </div >
      )}
    </>
  )
}

export default Post


