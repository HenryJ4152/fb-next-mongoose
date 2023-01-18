
function LeftOption({ Icon, title, imgSrc }) {
  return (
    <div className='cursor-pointer flex items-center space-x-3 px-3 py-2 hover:bg-stone-700 transform ease-out duration-100'>
      {imgSrc ? (
        <img className=" w-6 h-6 rounded-full" src={imgSrc} alt="profile pic" />
      ) : (
        <Icon className=" bg-transparent" />
      )}
      <p className=" bg-transparent whitespace-nowrap overflow-clip" >{title}</p>
    </div>
  )
}

export default LeftOption