import { getMessages, postMessage } from '../../../controller/messageController'
import connectDB from '../../../utils/connectDB'


//api/messages/[id1id2]
export default async function handler(req, res) {
  const { method } = req

  await connectDB()

  switch (method) {
    case 'GET':
      getMessages(req, res)
      break
    case 'POST':
      postMessage(req, res)
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



