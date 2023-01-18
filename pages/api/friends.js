import { updateFriends } from "../../controller/friendsController"
import connectDB from "../../utils/connectDB"


// api/friends
export default async function handler(req, res) {
  const { method } = req

  await connectDB()

  switch (method) {
    case 'GET':
      break
    case 'POST':
      updateFriends(req, res)
      break
    case 'DELETE':
      break
    case 'PUT':
      break
    default:
      res.status(400).json({ success: false, msg: `${method} method is not supported` })
      break
  }

}