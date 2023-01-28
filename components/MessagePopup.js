import { Avatar } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Message from "./Message";
import { toggleOpen } from "../redux/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchMessages, fetchPostMessage } from "../utils/helpers";
import { useMutation, useQuery, useQueryClient } from "react-query";

function MessagePopup() {

  const dispatch = useDispatch()
  const messageFormRef = useRef()
  const msgTextAreaRef = useRef()

  const [messageInput, setMessageInput] = useState("")

  const { data: session } = useSession()
  const messagingUser = useSelector((state) => state.messageReducer.messagingUser)

  // console.log(messagingUser);


  const id1 = session?.user?.id || "000"
  const id2 = messagingUser?.id


  const { isLoading, error, data } = useQuery([`messages`, id1, id2], () => fetchMessages(id1, id2))

  //scroll to bottom of msgs
  const endOfMessages = useRef()
  useEffect(() => {
    endOfMessages.current.scrollIntoView({ behavior: "smooth" })

  }, [endOfMessages, data])



  useEffect(() => {
    //changes height of the text area
    msgTextAreaRef.current.style.height = "0px"

    let scrollHeight = msgTextAreaRef.current.scrollHeight;
    if (scrollHeight >= 130) {
      scrollHeight = 130
    }
    msgTextAreaRef.current.style.height = scrollHeight + "px";
    messageFormRef.current.style.height = scrollHeight + "px";
  }, [messageInput])



  const onEnterEscPress = (e) => {
    // !!! pressing Enter in textarea does not submit form so need this fxn
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSendMessage(e);
    }
    if (e.keyCode === 27) {
      //Escape pressed
    }
  }


  const queryClient = useQueryClient()
  const sendMutation = useMutation(([docId, senderId, msg]) => fetchPostMessage(docId, senderId, msg), {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('messages')
      console.log("success");
      setMessageInput("")
    },
  })


  const handleSendMessage = (e) => {
    e.preventDefault();

    const msg = msgTextAreaRef.current.value
    const messageDocId = data._id
    const senderId = session?.user?.id.substring(0, 17) || "000"

    sendMutation.mutate([messageDocId, senderId, msg])
  }



  return (
    <div className='flex flex-col items-center fixed bottom-0 right-16 h-80 w-60 bg-stone-600'>

      {/* header */}
      <div className="flex justify-between w-full py-2 bg-stone-800 px-0.5 ">
        <div className=" flex items-center flex-1 truncate w-[70%]">
          {messagingUser ? (
            <Avatar className=" scale-75">
              <img src={messagingUser.image} alt="" />
            </Avatar>
          ) : (
            <Avatar className=" scale-75  m-0 text-sm"></Avatar>
          )}
          <p className=" inline-block text-sm whitespace-nowrap ml-1 flex-wrap truncate">{messagingUser?.name || "New message"}</p>
          <KeyboardArrowDownIcon className=" -ml-1 scale-75" />
        </div>

        <div className=" flex items-center space-x-0">
          <div className="flex items-center justify-center cursor-pointer bg-transparent hover:bg-stone-500 rounded-full h-5 w-5">
            <LocalPhoneIcon className=" p-0  scale-75" />
          </div>
          <div className="flex items-center justify-center cursor-pointer bg-transparent hover:bg-stone-500 rounded-full h-5 w-5">
            <VideocamIcon className=" p-0  scale-75" />
          </div>
          <div className="flex items-center justify-center cursor-pointer bg-transparent hover:bg-stone-500 rounded-full h-5 w-5">
            <RemoveIcon className=" p-0  scale-75 " />
          </div>
          <div onClick={() => dispatch(toggleOpen())} className="flex items-center justify-center cursor-pointer bg-transparent hover:bg-stone-500 rounded-full h-5 w-5">
            <CloseIcon className=" p-0  scale-75 " />
          </div>
        </div>
      </div>

      {/* messages */}
      <div className=" flex-1 w-full bg-stone-800 flex-col flex overflow-y-scroll scrollbar-thin scrollbar-thumb-stone-100">

        {data?.messages?.map(msg => (
          <Message key={msg._id} sender={msg.sender == id1} text={msg.message} />
        ))}

        <div ref={endOfMessages} className="h-0.5"></div>

      </div>

      {/* input  */}
      <div className="flex items-center w-full bg-stone-800 ">
        <form
          ref={messageFormRef}
          onKeyDown={onEnterEscPress}
          className=" flex-1 flex rounded-xl m-0 p-0 mb-3"
        >
          <textarea
            ref={msgTextAreaRef}
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            type="text"
            className="w-full resize-none bg-stone-700 m-1 my-2 outline-none  flex-1 pl-3 text-sm py-1 inset-0 break-all scrollbar-thin scrollbar-thumb-slate-200 pr-2 mb-10" placeholder="Aa"
          />
        </form>


        {/* <form
          // ref={editFormRef}
          className=" w-full flex-1 rounded-xl m-0 p-0 inline"
        // onKeyDown={onEnterEscPress}

        >
          <textarea
            // ref={editTextAreaRef}
            // value={commentInput}
            // onChange={e => setCommentInput(e.target.value)}
            className=" w-full flex-1 outline-none resize-none text-sm pb-0 inset-0 break-all scrollbar-thin scrollbar-thumb-slate-200 pr-2"
            type="text">
          </textarea>
        </form> */}

        <div className=" mr-2">
          <ThumbUpIcon className=" h-5 scale-75 " />
        </div>
      </div>
    </div>

  )
}

export default MessagePopup