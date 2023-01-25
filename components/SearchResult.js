import { Avatar } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/router';


function SearchResult({ id, name, image, setShowResults }) {

  const router = useRouter()

  const handleClick = () => {
    setShowResults(false)
    router.push(`/${id}`)
  }

  return (
    // <Link href={`/${id}`} >
    <div onClick={handleClick} className=' flex items-center justify-between px-3 hover:bg-stone-700 cursor-pointer rounded-md mb-2'>
      <div className=' flex items-center'>
        <Avatar className=' mr-3 my-1'>
          <img
            className=''
            src={image} alt=""
          />
        </Avatar>
        <p>{name}</p>
      </div>
      <div className='flex justify-center items-center bg-transparent hover:bg-stone-600 cursor-pointer h-6 w-6 rounded-full'>
        <CloseIcon className=' fill-stone-400 h-4 w-4  scale-90 ' />
      </div>
    </div>
    // </Link>
  )
}

export default SearchResult