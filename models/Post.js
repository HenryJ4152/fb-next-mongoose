import { Schema, models, model } from 'mongoose'

const postSchema = new Schema({
  author: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
  },
  postPic: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  numLikes: {
    type: Number,
    default: 0
  },
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [
      {
        commentorId: String,
        name: String,
        profilePic: String,
        comment: String,
      }, { timestamps: true }
    ],
    default: [],
  },


}, { timestamps: true })


module.exports = models?.post || model('post', postSchema)
