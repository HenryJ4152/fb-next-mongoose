
function StoriesContainer() {
  return (
    <div className=" w-full flex items-center flex-col  px-2 bg-stone-800 mt-4 mb-4 rounded-xl">

      <div className=" w-full flex flex-row justify-evenly space mt-2  ">
        {/* selected */}
        <div className=" flex-1 border-b-4 border-blue-500 mx-2 ">
          <button className=" w-full py-2 text-blue-500 font-bold rounded-lg">
            Stories
          </button>
        </div>
        {/* not selected */}
        <div className=" flex-1   mx-2  ">
          <button className=" w-full  py-2 font-bold hover:bg-stone-700 rounded-lg">
            Reels
          </button>
        </div>
      </div>


      <div className=" w-full h-48 flex justify-between my-2 py-2 px-2 space-x-2">
        <div className=" w-32 flex  justify-center bg-stone-600 rounded-xl overflow-hidden">
          <img
            className=""
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
            alt="story"
          />
        </div>
        <div className=" w-32 flex  justify-center bg-stone-600 rounded-xl overflow-hidden">
          <img
            className=" "
            src="https://media.istockphoto.com/id/1136437406/photo/san-francisco-skyline-with-oakland-bay-bridge-at-sunset-california-usa.jpg?s=612x612&w=0&k=20&c=JVBBZT2uquZbfY0njYHv8vkLfatoM4COJc-lX5QKYpE="
            alt=""
          />
        </div>
        <div className=" w-32 flex  justify-center bg-stone-600 rounded-xl overflow-hidden">
          <img src="https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/WOPA160517_D056-resized.jpg?crop=864%2C0%2C1728%2C2304&wid=600&hei=800&scl=2.88" alt="" />
        </div>
        <div className=" w-32 flex  justify-center bg-stone-600 rounded-xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8bmF0dXJhbHxlbnwwfHwwfHw%3D&w=1000&q=80" alt="" />
        </div>
      </div>
    </div>
  )
}

export default StoriesContainer