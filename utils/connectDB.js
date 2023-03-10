/* This is a database connection function*/
import mongoose from 'mongoose'

const connection = {} /* creating connection object*/


if (!process.env.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

async function connectDB() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return
  }

  console.log('process.env.MONGODB_URI', process.env.MONGODB_URI)
  /* connecting to our database */
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  connection.isConnected = db.connections[0].readyState
}

export default connectDB
