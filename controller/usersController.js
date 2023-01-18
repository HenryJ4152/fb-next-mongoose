import User from '../models/User'

export const getUserProfile = async (req, res) => {

  const userId = req.query.userId

  if (!userId) res.status(404).json({ msg: "userId not provided" })

  try {
    console.log("searching for", userId);
    // const userMongoDB = await User.find({ "id": userId.slice(0, 17) })
    const userMongoDB = await User.findById(userId)
    console.log("usermongodb", userMongoDB)

    if (userMongoDB) res.status(200).json(userMongoDB)
    if (!userMongoDB) res.status(404).json({ msg: "user not found" })

  } catch (error) {
    res.status(404).json(error)
  }
}
