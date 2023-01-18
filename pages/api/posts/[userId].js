import { getUserPosts } from '../../../controller/postsController'
import connectDB from '../../../utils/connectDB'


//api/posts/[userId]
export default async function handler(req, res) {
  const { method } = req

  await connectDB()

  switch (method) {
    case 'GET':
      getUserPosts(req, res)
      break
    case 'POST':
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
