import { Avatar } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FeedbackIcon from '@mui/icons-material/Feedback';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { closeSignInPopup, toggleSignInPopup } from '../redux/headerSlice';
import Link from 'next/link';

function SignInPopup({ avatarRef }) {

  const { data: session } = useSession()
  const popupRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {

    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target) && !avatarRef.current.contains(event.target)) {
        dispatch(toggleSignInPopup())
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  return (

    session ? (
      <div ref={popupRef} className=' flex flex-col fixed right-2 top-12 bg-stone-800  rounded-lg py-2 px-1 w-72'>
        <Link onClick={() => dispatch(toggleSignInPopup())} href={`/${session?.user?.id}`}>
          <div className=' flex items-center space-x-2 shadow-lg p-2 rounded-lg hover:bg-stone-700 cursor-pointer'>
            <Avatar
              src={session?.user?.image || ""}
              className=' rounded-full'
            />
            <div>
              {session?.user?.name}
            </div>
          </div>
        </Link>
        <br className="" />

        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <SettingsIcon />
            <div>Settings & privacy</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <HelpIcon />
            <div>Help & support</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <DarkModeIcon />
            <div>Display & accessibility</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <FeedbackIcon />
            <div>Give feedback</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div onClick={() => signOut()} className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <LogoutIcon />
            <div>Log Out</div>
          </div>
        </div>

        <div className=' text-xs p-2'>
          Privacy · Terms · Advertising · Ad Choices · Cookies · More © 2023
        </div>
      </div>
    ) : (
      <div ref={popupRef} className=' flex flex-col fixed right-2 top-12 bg-stone-700  rounded-lg py-2 px-1 w-72'>
        <div
          onClick={() => signIn()}
          className=' flex items-center space-x-2 shadow-xl p-2 rounded-lg hover:bg-stone-700 cursor-pointer justify-center'>
          {/* <LoginIcon /> */}
          <div>Sign In</div>
        </div>

        <br className="" />


        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <SettingsIcon />
            <div>Settings & privacy</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <HelpIcon />
            <div>Help & support</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <DarkModeIcon />
            <div>Display & accessibility</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>
        <div className='flex items-center justify-between hover:bg-stone-700 p-2 rounded-lg cursor-pointer'>
          <div className='flex items-center space-x-2'>
            <FeedbackIcon />
            <div>Give feedback</div>
          </div>
          <KeyboardArrowRightIcon />
        </div>

        <div className=' text-xs p-2'>
          Privacy · Terms · Advertising · Ad Choices · Cookies · More © 2023
        </div>
      </div>
    )

  )
}

export default SignInPopup