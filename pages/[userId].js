import { Avatar } from "@mui/material"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useSelector } from "react-redux"
import Header from "../components/Header"
import MessagePopup from "../components/MessagePopup"
import NewMessageButton from "../components/NewMessageButton"
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import CreateIcon from '@mui/icons-material/Create';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CreatePostContainer from "../components/CreatePostContainer"
import CreatePostModal from "../components/CreatePostModal"
import EditPostModal from "../components/EditPostModal"
import { checkUserInDb, fetchAllPosts, fetchAllUsersPosts, fetchPostFriendReq, fetchUserWithId, getUserProfile, ssrGetPosts, ssrGetUsers, ssrGetUsersPosts } from "../utils/helpers"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]"
import connectDB from "../utils/connectDB"
import Post from "../components/Post"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function UserPage({ userSSR, users, posts }) {

  // console.log(posts)

  const creatingPost = useSelector((state) => state.postReducer.creatingPost)
  const editingPost = useSelector((state) => state.postReducer.editingPost)
  const messageOpen = useSelector((state) => state.messageReducer.open)
  const { data: session } = useSession()
  // console.log(session);

  const router = useRouter()
  const { userId } = router.query
  // console.log(userId);

  const { isLoading, error, data } = useQuery([`posts`, userId], () => fetchAllUsersPosts(userId))



  const userProfile = useQuery([`user`, userId], () => fetchUserWithId(userId))
  // console.log(userProfile?.data);
  // console.log(userProfile?.data?.friends.includes(session.user.id));
  // console.log(userProfile?.data?.receivedFriendReqs.includes(session.user.id));
  // console.log(userProfile?.data?.sentFriendReqs.includes(session.user.id));


  const [allowPost, setAllowPost] = useState(false)
  const [guestUser, setGuestUser] = useState(false)


  const [friendStatus, setFriendStatus] = useState("Add friend")
  //friendstatuschanged = for keeping track of status client side
  const [friendStatusChanged, setFriendStatusChanged] = useState(null)



  useEffect(() => {
    //reset state when routing in dynamic page
    setAllowPost(false)
    setGuestUser(false)
    setFriendStatus("Add friend")
    setFriendStatusChanged(null)
  }, [userId])




  // console.log(user.friends)
  // console.log(user.sentFriendReqs)
  // console.log(user.receivedFriendReqs)
  useEffect(() => {
    if (session) {
      if (userSSR?.friends?.includes(session?.user?.id.substring(0, 17))) {
        // users are added as friends
        setFriendStatus("Friends")
      }
      else if (userSSR?.sentFriendReqs?.includes(session?.user?.id.substring(0, 17))) {
        // user sent friend req to session.user
        setFriendStatus("Accept friend request")
      }
      else if (userSSR?.receivedFriendReqs?.includes(session?.user?.id.substring(0, 17))) {
        // user pending response from session.user's friend req
        setFriendStatus("Friend request sent")
      }
      else {
        setFriendStatus("Add friend")
      }
    }
    if (userProfile && session) {
      // console.log(userProfile.data)
      // console.log("userprofile.data.friends", userProfile?.data?.friends)
      if (userProfile?.data?.friends?.includes(session.user.id)) setFriendStatus("Friends")
      if (userProfile?.data?.sentFriendReqs?.includes(session.user.id)) setFriendStatus("Accept friend request")
      if (userProfile?.data?.receivedFriendReqs?.includes(session.user.id)) setFriendStatus("Friend request sent")
    }
  }, [userId, session, userProfile])


  const queryClient = useQueryClient()
  const friendMutation = useMutation(([senderId, receiverId, action]) => fetchPostFriendReq(senderId, receiverId, action), {
    onSuccess: (data) => {
      // Invalidate and refetch
      console.log("should be invalidating by calling fetchUserWithId but it does not when going to second user page");
      // queryClient.invalidateQueries(`user`)

      //get object returned from fetchPostFriendReq and check for session.user.id and then setFriendStatus accordingly 
      console.log(data)
      if (data.friends?.includes(session.user.id)) {
        console.log("friends");
        setFriendStatusChanged("Friends")
      }
      if (data.receivedFriendReqs?.includes(session.user.id)) {
        console.log("friend req sent")
        setFriendStatusChanged("Friend request sent")
      }
    },
  })

  const handleFriendReq = async () => {
    // hit up helper fxn -> api/friends -> add
    if (friendStatus === "Add friend") {

      const senderId = session.user.id.substring(0, 17)
      const receiverId = userId
      const action = "REQUEST"
      // const res = await fetchPostFriendReq(senderId, receiverId, action)
      // console.log(res)
      friendMutation.mutate([senderId, receiverId, action])

    } else if (friendStatus === "Accept friend request") {
      console.log("handle accept friend req")
      const receiverId = session.user.id.substring(0, 17)
      const senderId = userId
      const action = "ACCEPT"
      // const res = await fetchPostFriendReq(senderId, receiverId, action)
      // console.log(res)
      friendMutation.mutate([senderId, receiverId, action])
    }
  }


  //allowing post and determining if current page is guestUser
  useEffect(() => {
    // user is signed in - session
    if (session?.user?.id.substring(0, 17) === userId) {
      // user is on his own page
      setAllowPost(true)
    } else {
      setAllowPost(false)
    }
    // no user signed in - no session
    if (userId === "000" && !session) {
      // guest is on guest page
      setAllowPost(true)
      setGuestUser(true)
    } else if (userId === "000") {
      setGuestUser(true)
    } else {
      setGuestUser(false)
    }
  }, [userId, session])




  return (
    <div className=' flex flex-col overflow-x-hidden'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header users={users} />

      <main className='bg-stone-900  flex flex-col items-center h-screen w-full py-12  mx-auto '>

        {/* UserPageTop */}
        <div className="  flex flex-col bg-stone-800 w-full mx-auto justify-center ">
          {/* 1 */}
          <img
            className="  w-[70vw] h-[50vh] object-cover rounded-b-lg  mx-auto  "
            src="https://miro.medium.com/max/1400/1*2tmzU7bve-VlTkOMWsk_Hw.jpeg" alt=""
          />
          {/* 2 */}
          <div className=" flex px-4 space-x-3 mb-1 w-[70vw] mx-auto">

            {!guestUser ? (
              <img className="rounded-full h-32 w-32 -mt-3 object-cover" src={userSSR?.image} alt="user profile image" />
            ) : (
              <img className="rounded-full h-32 w-32 -mt-3 object-scale-down" src={"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="user profile image" />
            )}

            <div className=" flex flex-col mt-3 w-full">
              <p className=" font-bold text-3xl mb-1">{userSSR?.name || "Guest User"}</p>
              <p className=" text-sm text-stone-300 mb-1">500 friends</p>

              <div className=" flex justify-between w-full bg-stone-800">
                <div className=" flex">
                  <Avatar className=" scale-75 -ml-3 z-40 bg-blue-700" />
                  <Avatar className=" scale-75 -ml-3 z-40 bg-blue-600" />
                  <Avatar className=" scale-75 -ml-3 z-40 bg-blue-500" />
                  <Avatar className=" scale-75 -ml-3 z-30 bg-blue-400" />
                  <Avatar className=" scale-75 -ml-3 z-20 bg-blue-300" />
                  <Avatar className=" scale-75 -ml-3 z-10 bg-blue-200" />
                  <Avatar className=" scale-75 -ml-3 z-0 bg-blue-100" />

                </div>

                {allowPost && !guestUser &&
                  <div className=" flex space-x-2">
                    <button className=" text-sm bg-blue-500 px-1.5 py-0.5 flex items-center space-x-1 rounded-md pb-1">
                      <span><AddCircleRoundedIcon className=" scale-75 " /></span>
                      <p>Add to story</p>
                    </button>
                    <button className=" text-sm bg-stone-600 px-1.5 py-0.5 flex items-center space-x-1 rounded-md pb-1">
                      <span><CreateIcon className=" scale-75  " /></span>
                      <p>Edit profile</p>
                    </button>
                  </div>
                }

                {!allowPost && !guestUser && session &&
                  <div className=" flex space-x-2">
                    <button className=" text-sm bg-stone-600 px-1.5 py-0.5 flex items-center space-x-1 rounded-md pb-1">
                      <span><ChatBubbleIcon className=" scale-75 " /></span>
                      <p>Message</p>
                    </button>
                    <button onClick={handleFriendReq} className=" text-sm bg-blue-500 px-1.5 py-0.5 flex items-center space-x-1 rounded-md pb-1">
                      <span><PersonAddIcon className=" scale-75 " /></span>
                      {friendStatusChanged &&
                        <p>{friendStatusChanged}</p>
                      }
                      {!friendStatusChanged &&
                        <p>{friendStatus}</p>
                      }
                    </button>
                  </div>
                }


              </div>
            </div>
          </div>
          {/* 3 */}
          <div className=" bg-stone-800 flex px-4 items-center justify-between border-t border-stone-600 py-1 w-[70vw] mx-auto" >
            <div className=" flex space-x-0 bg-stone-800">
              <button className=" hover:bg-stone-600 px-3 py-2 rounded-md transition transform duration-300 ease-out ">Posts</button>
              <button className=" hover:bg-stone-600 px-3 py-2 rounded-md ">About</button>
              <button className=" hover:bg-stone-600 px-3 py-2 rounded-md ">Friends</button>
              <button className=" hover:bg-stone-600 px-3 py-2 rounded-md ">Photos</button>
              <button className=" hover:bg-stone-600 px-3 py-2 rounded-md ">Videos</button>
              <button className=" hover:bg-stone-600 px-3 py-2 rounded-md ">Check-ins</button>
              <button className=" hover:bg-stone-600 px-3 py-2 pr-1 rounded-md">More <ArrowDropDownIcon className=" -ml-1 p-0" /></button>
            </div>
            <div>
              <button className=" bg-stone-700 hover:bg-stone-600 px-1 py-0.5 rounded-md ">
                <MoreHorizIcon className=" p-1" />
              </button>
            </div>
          </div>

        </div>


        {/* intro photos and posts */}
        <div className=" w-screen bg-stone-900 ">
          {/* for color */}

          <div className=" grid grid-cols-5 px-4 w-[70vw] mx-auto pt-5 gap-3">
            {/* left = intro - photos - friends */}
            <div className=" left col-span-2 pb-12 ">
              <div className=" bg-stone-800 rounded-md px-4 py-4 text-xl font-bold mb-4">
                Intro
              </div>

              <div className="flex flex-col bg-stone-800 rounded-md px-4 py-4 text-xl  mb-4">
                <div className=" flex justify-between items-center mb-4">
                  <p className=" font-bold hover:underline cursor-pointer">Photos</p>
                  <p className=" cursor-pointer font-normal text-base hover:bg-stone-700 px-2 py-1 rounded-md text-blue-400 -mr-1">See all photos</p>
                </div>

                <div className=" grid grid-cols-3 gap-1">
                  <img className=" w-24 cursor-pointer" src={userSSR?.image} alt="" />
                  {/* <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" />
                  <img className=" w-24 cursor-pointer" src={user.image} alt="" /> */}
                </div>
              </div>

              <div className=" bg-stone-800 rounded-md px-4 py-4 text-xl  mb-4">
                <div className=" flex justify-between items-center ">
                  <p className=" font-bold hover:underline cursor-pointer">Friends</p>
                  <p className=" cursor-pointer font-normal text-base hover:bg-stone-700 px-2 py-1 rounded-md text-blue-400 -mr-1">See all friends</p>
                </div>
                <div className=" mb-4">
                  <p className=" font-light text-base">500 friends</p>
                </div>

                <div className=" grid grid-cols-3 gap-2">
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={userSSR?.image} alt="" />
                    <p className=" text-base font-medium">{userSSR?.name}</p>
                  </div>
                  {/* <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div>
                  <div>
                    <img className=" w-24 cursor-pointer rounded-md" src={user.image} alt="" />
                    <p className=" text-base font-medium">{user.name}</p>
                  </div> */}
                </div>

              </div>


            </div>
            {/* right = createPostsection - posts */}
            <div className=" right col-span-3 ">
              {allowPost && <CreatePostContainer />}
              <div className=" bg-stone-800 rounded-md px-4 py-4 text-xl font-bold mb-4">
                Posts
              </div>

              {
                data ? (
                  data?.map(({ _id, author, comments, likes, text }) => (
                    <Post key={_id} postId={_id} author={author} comments={comments} likes={likes} text={text} />
                  ))
                ) : (
                  // technically dont need this bc on enter page user needs to scroll down before seeing this and by that time data is already loaded
                  posts?.map(({ _id, author, comments, likes, text }) => (
                    <Post key={_id} postId={_id} author={author} comments={comments} likes={likes} text={text} />
                  ))
                )
              }


            </div>
          </div>
        </div>

        {editingPost && <EditPostModal />}

        {creatingPost && <CreatePostModal />}

        <NewMessageButton />
        {messageOpen && <MessagePopup />}

      </main>
    </div>
  )
}




export async function getServerSideProps(context) {

  const userIdOfPage = context.query.userId
  console.log("userIdOfPage: " + userIdOfPage);

  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  // console.log(session);
  // console.log(session.user.id);
  await connectDB()

  // if (session) {

  //   const id = session.user.id
  //   const user = checkUserInDb(session)
  // }
  //!!! get user info

  // this is currently getting userId of the person logged in. we need to get userId of page we are on
  const user = await getUserProfile(userIdOfPage)
  const users = await ssrGetUsers()
  const posts = await ssrGetUsersPosts(userIdOfPage)

  if (userIdOfPage === "000") {
    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        posts: JSON.parse(JSON.stringify(posts))
      }
    }
  }

  return {
    props: {
      session,
      userSSR: JSON.parse(JSON.stringify(user)),
      users: JSON.parse(JSON.stringify(users)),
      posts: JSON.parse(JSON.stringify(posts))
    },
  }
}


export default UserPage