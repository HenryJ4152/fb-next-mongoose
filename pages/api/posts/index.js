import { deleteAPost, getAllPosts, postAPost, updateAPost } from '../../../controller/postsController'
import Post from '../../../models/Post'
import connectDB from '../../../utils/connectDB'


//api/posts
export default async function handler(req, res) {
  const { method } = req

  await connectDB()

  switch (method) {
    case 'GET':
      getAllPosts(req, res)
      break
    case 'POST':
      postAPost(req, res)
      break
    case 'DELETE':
      deleteAPost(req, res)
      break
    case 'PUT':
      updateAPost(req, res)
      break
    default:
      res.status(400).json({ success: false, msg: `${method} method is not supported` })
      break
  }
}
