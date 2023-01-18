import Message from '../models/Message'

// GET /api/messages/[id1id2]
export const getMessages = async (req, res) => {
  // bothIds = id1 + "-" + id2
  const bothIds = req.query.id1id2
  const id1 = bothIds.split("-")[0]
  const id2 = bothIds.split("-")[1]

  // console.log("id1: " + id1);      // console.log("id2: " + id2);
  try {
    const messages = await Message.find({
      participants: { $all: [id1, id2] }
    })
    console.log("messages", messages[0])
    if (!messages[0]) {
      const newCreatedMessage = Message.create({
        participants: [id1, id2],
        messages: []
      })
      res.status(200).json(newCreatedMessage)
    }
    res.status(200).json(messages[0])
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

// POST /api/messages/[id1id2]
export const postMessage = async (req, res) => {
  const { docId, senderId, msg } = req.body
  if (!docId || !senderId || !msg) res.status(400).json({ message: "missing docId senderId or msg" })

  try {
    const messagesDoc = await Message.findByIdAndUpdate(docId,
      {
        "$push": {
          "messages": {
            sender: senderId,
            message: msg,
          }
        }
      }, { new: true }
    )
    res.status(200).json(messagesDoc)
  } catch (error) {
    res.status(400).json({ success: false })
  }
}


