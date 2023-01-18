import { Avatar } from '@mui/material'
import { useRef } from 'react'
import VideocamIcon from '@mui/icons-material/Videocam';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setCreatingPost } from '../redux/postSlice';

function CreatePostContainer() {

  const { data: session } = useSession()





  const dispatch = useDispatch()

  const handleCreatePost = async (e) => {
    e.preventDefault()


    dispatch(setCreatingPost(true))
  }


  return (
    <div className=" w-full flex items-center flex-col  px-2 bg-stone-800 mb-4 rounded-xl">
      <div className=' flex flex-col w-full p-2 px-1 space-y-2 mt-2'>
        <div className=' flex w-full space-x-2 pb-3 border-b border-stone-500'>
          <Avatar src={session?.user.image} />
          <div className=' flex flex-1 bg-stone-700 px-2 rounded-xl py-1 cursor-pointer text-stone-300' onClick={handleCreatePost}>
            Write a post
          </div>
        </div>


        <div className=' flex justify-evenly space-x-2'>
          <div className=' flex items-center space-x-1 cursor-pointer hover:bg-stone-600 rounded-lg p-1 flex-1 justify-center '>
            <VideocamIcon className='fill-red-500  ' />
            <p className=' text-sm'>
              Live Video
            </p>
          </div>
          <div className=' flex items-center space-x-1 cursor-pointer hover:bg-stone-600 rounded-lg p-1 flex-1 justify-center'>
            <AddPhotoAlternateIcon className='fill-green-400' />
            <p className=' text-sm'>
              Photo/video
            </p>
          </div>
          <div className=' flex items-center space-x-1 cursor-pointer hover:bg-stone-600 rounded-lg p-1 flex-1 justify-center '>
            <InsertEmoticonIcon className='fill-yellow-500' />
            <p className=' text-sm'>
              Feeling/activity
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePostContainer