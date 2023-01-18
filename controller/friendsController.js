import User from '../models/User'


// POST api/friends
export const updateFriends = async (req, res) => {
  const body = req.body
  const { senderId, receiverId, action } = body
  if (!senderId || !receiverId || !action) return res.status(400).json({ msg: "Missing request params" })

  try {

    if (action === "REQUEST") {
      const sender = await User.findOneAndUpdate(
        { id: senderId },
        { "$push": { "sentFriendReqs": receiverId } },
        { new: true }
      )
      const receiver = await User.findOneAndUpdate(
        { id: receiverId },
        { "$push": { "receivedFriendReqs": senderId } },
        { new: true }
      )
      res.status(201).json(receiver)
    }
    else if (action === "ACCEPT") {
      console.log("handle action === ACCEPT")
      // receiverId is accepting friend request from senderId 
      const sender = await User.findOneAndUpdate(
        { id: senderId },
        { "$pull": { "sentFriendReqs": receiverId }, "$push": { "friends": receiverId } },
        // { "$push": { "friends": receiverId } },
        { new: true }
      )
      const receiver = await User.findOneAndUpdate(
        { id: receiverId },
        { "$pull": { "receivedFriendReqs": senderId }, "$push": { "friends": senderId } },
        // { "$push": { "friends": senderId } },
        { new: true }
      )
      res.status(201).json(sender)

    }



  } catch (error) {

    res.status(400).json(error)

  }
}