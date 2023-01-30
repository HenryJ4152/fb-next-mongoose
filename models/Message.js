
import { Schema, models, model } from 'mongoose'

const messageSchema = new Schema({
  // _id auto generated
  participants: {
    type: [String],
    required: true,
  },
  messages: {
    type: [
      {
        sender: String,
        message: String,
        createdAt: Date,
      }
    ],
    required: true,
  },


}, { timestamps: true })


module.exports = models?.message || model('message', messageSchema)
