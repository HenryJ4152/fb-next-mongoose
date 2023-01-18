
function Message({ sender, text }) {
  return (
    <div>
      {
        sender ? (
          <div className=" flex justify-end mr-2 my-0.5 ml-10 ">
            <p className=" bg-blue-500 p-1 px-2 rounded-2xl text-sm">{text}</p>
          </div>

        ) : (
          <div className=" flex ml-2 my-0.5 mr-10 ">
            <p className="bg-stone-700 p-1 px-2 rounded-2xl text-sm">{text}</p>
          </div>
        )
      }
    </div>
  )
}

export default Message