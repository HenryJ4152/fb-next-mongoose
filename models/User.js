import { Schema, models, model } from 'mongoose'

const userSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  friends: {
    type: [String],
    required: true,
  },
  sentFriendReqs: {
    type: [String],
    required: true,
  },
  receivedFriendReqs: {
    type: [String],
    required: true,
  }
}, { timestamps: true })


module.exports = models?.user || model('user', userSchema)
