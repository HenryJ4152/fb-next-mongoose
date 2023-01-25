import { Avatar } from "@mui/material"
import { useDispatch } from "react-redux"
import { setMessagingUser } from "../redux/messageSlice"

function RightUser({ id, image, name, user }) {

  const dispatch = useDispatch()

  const handleClick = () => {
    if (user) {
      // console.log(user)
      dispatch(setMessagingUser(user))
    }
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex items-center space-x-2 px-3 py-2 hover:bg-stone-700 transform ease-out duration-100 ">
      {image ? (
        <Avatar className=" scale-90  text-sm">
          <img src={image} alt="" />
        </Avatar>
      ) : (
        <Avatar className=" scale-90 text-sm" ></Avatar>
      )}
      <p className=" bg-transparent">{name}</p>
    </div>
  )
}

export default RightUser