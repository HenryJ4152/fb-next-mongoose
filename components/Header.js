import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, IconButton } from '@mui/material';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSignInPopup } from '../redux/headerSlice';
import SignInPopup from './SignInPopup';
import CloseIcon from '@mui/icons-material/Close';
import SearchResult from './SearchResult';

function Header({ users }) {

  // console.log(users);

  const dispatch = useDispatch()
  const { data: session } = useSession()
  const { data } = useSession()
  const avatarRef = useRef()
  const searchInputRef = useRef()
  const searchResultsRef = useRef()


  const signInPopupOpen = useSelector(state => state.headerReducer.open)

  const avatarClicked = () => {
    console.log(data);
    // console.log(session);
    dispatch(toggleSignInPopup())
  }


  const [showResults, setShowResults] = useState(false)
  const searchInputClicked = () => {
    setShowResults(true)
  }
  //handling click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchInputRef.current && searchResultsRef.current && !searchInputRef.current.contains(event.target) && !searchResultsRef?.current?.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //


  return (
    <header className=" flex bg-stone-800 p-2 justify-between fixed top-0 left-0 right-0 z-50">
      {/* FB icon */}
      <Link href={"/"} >
        <div className=" w-28  bg-transparent">
          <img
            className=" bg-transparent h-8 w-8"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="fb-icon" />
        </div>
      </Link>


      {/* middle search bar */}
      <div className=' flex bg-transparent items-center relative  '>
        <input
          ref={searchInputRef}
          onClick={searchInputClicked}
          className=' bg-stone-700 box-border pl-7 pr-2 py-1 w-[40vw] rounded-full outline-none hover:bg-stone-600 active:bg-stone-700'
          type="text"
          placeholder="Search Facebook"
        />
        <SearchIcon className='bg-transparent pointer-events-none absolute box-border p-1 ml-1  ' />

        {/* SearchResults */}
        {showResults &&
          <div ref={searchResultsRef} className='w-[40vw] bg-stone-800 absolute top-10 px-1 py-2 shadow-2xl flex flex-col'>
            <div className="flex justify-between">
              <p className=' font-semibold text-lg p-3'>All Users</p>
              <p className=' font-semibold text-lg p-3 text-blue-500'>Edit</p>
            </div>
            {/* user search results */}
            {users?.map(user => (

              <SearchResult key={user._id} image={user.image} name={user.name} id={user.id} setShowResults={setShowResults} />
            ))}

          </div>
        }
      </div>
      {/* middle search bar */}


      {/* right msg icon bell icon profile pic*/}
      <div className=' bg-transparent flex items-center space-x-2'>
        <div className='bg-stone-600 rounded-full p-1 w-8 h-8'>
          <MapsUgcIcon className=' bg-transparent p-1 mb-2 ' />
        </div>
        <div className='bg-stone-600 rounded-full p-1 w-8 h-8'>
          <NotificationsIcon className=' bg-transparent p-1 mb-2' />
        </div>

        <div ref={avatarRef} onClick={avatarClicked} className="cursor-pointer">
          {session ? (
            <Avatar
              src={session?.user?.image || ""}
              className=' rounded-full'
            />
          ) : (
            <Avatar
              // src={session?.user?.image || ""}
              className=' rounded-full'
            />
          )}
        </div>

      </div>

      {signInPopupOpen && <SignInPopup avatarRef={avatarRef} />}


    </header >
  )
}

export default Header