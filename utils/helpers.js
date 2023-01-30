import User from "../models/User"
import Post from "../models/Post"
import Message from "../models/Message"


//helper fxn 
export const fetchAllPosts = async () => {
  const res = await fetch('/api/posts')
  const data = await res.json()
  return data
}


export const fetchUserWithId = async (userId) => {
  console.log("fetchUserWithId", userId);
  // console.log(userId)
  const res = await fetch(`/api/users/${userId}`)
  const data = await res.json()
  // console.log(data)
  return data
}



export const fetchAllUsersPosts = async (userId) => {
  // console.log(userId)
  const res = await fetch(`/api/posts/${userId}`)
  const data = await res.json()
  // console.log(data)
  return data
}


// sending a friend req
export const fetchPostFriendReq = async (senderId, receiverId, action) => {
  const res = await fetch('api/friends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      senderId,
      receiverId,
      action
    })
  })
  const data = await res.json()
  return data

}



export const fetchCreatePost = async (id, email, name, image, postText) => {

  const res = await fetch('api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "author": {
        "id": id.slice(0, 17) || 0,
        "email": email || "guestuser",
        "name": name || "Guest User",
        "profilePic": image
      },
      "text": postText,
    })
  })
  const data = await res.json()
  return data

}

export const fetchDeletePost = async (postId) => {
  const data = await fetch(`/api/posts`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId
    })
  })
  const res = await data.json()
  console.log(res)
}

export const fetchUpdatePost = async (postId, updatedText) => {
  console.log(postId)
  console.log(updatedText)

  const data = await fetch('/api/posts', {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      updatedText,
    })
  })
  const res = await data.json()
  console.log(res)
}

export const fetchUpdatePostLikes = async (postId, toggleLikeId, addFlag) => {
  console.log(toggleLikeId)

  const data = await fetch('/api/posts', {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      toggleLikeId,
      addFlag
    })
  })
  const res = await data.json()
  console.log(res)

}


// /adding/pushing or deleting/pulling a comment 
export const fetchUpdatePostComments = async (postId, comment, addDeleteUpdate) => {
  console.log(comment)
  // comment: {
  //    name:
  //    profilePic:
  //    comment:
  // }

  const data = await fetch(`/api/posts`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      comment,
      addDeleteUpdate
    })
  })
  const res = await data.json()
  console.log(res)

}

// updating/setting a single comment
export const fetchUpdateAComment = async (postId, comment, commentId, addDeleteUpdate) => {
  console.log("fetchUpdateAComment", comment)
  // comment: {
  //    name:
  //    profilePic:
  //    comment:
  // }

  const data = await fetch(`/api/posts`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      postId,
      comment,
      commentId,
      addDeleteUpdate
    })
  })
  const res = await data.json()
  console.log(res)

}


export const fetchMessages = async (id1, id2) => {

  // console.log(userId)
  const res = await fetch(`/api/messages/${id1 + "-" + id2}`)
  const data = await res.json()
  // console.log(data)
  return data
}

export const fetchPostMessage = async (docId, senderId, msg, createdAt) => {

  const res = await fetch(`/api/messages/${docId}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      docId,
      senderId,
      msg,
      createdAt
    })
  })
  const data = await res.json()
  return data
}





// SSR
export const getUserProfile = async (userId) => {
  try {
    console.log("searching for", userId);
    // const userMongoDB = await User.find({ "id": userId.slice(0, 17) })
    const userMongoDB = await User.findById(userId)
    console.log("usermongodb", userMongoDB)
    return userMongoDB
    // if (userMongoDB.length === 1) {
    //   console.log("user found", userMongoDB);
    //   return userMongoDB[0]
    // }
  } catch (error) {
    return error
  }
}

// SSR
export const checkUserInDb = async (session) => {
  // console.log("check user in DB")
  // console.log("session: " + session.user.id);

  // !!!MONGO rounds the id up. id on client side is slightly diff from id on mongo but mongo still recognizes
  const id = session.user.id
  const fixedId = session.user.id.slice(0, 17)
  console.log(id)
  console.log(fixedId)
  try {
    // console.log("searching for ", fixedId);
    const userMongoDB = await User.findById(id)
    if (userMongoDB) {
      console.log("found user", userMongoDB);
      return userMongoDB
    }

    if (!userMongoDB) {
      // console.log("checkUserInDb not found ", fixedId)
      const user = await User.create({
        ...session.user,
        _id: id,
        id: fixedId,
      })
      // console.log('checkUserInDb created user', user);
      return user
    }
  } catch (error) {
    console.log(error);
  }
}



//SSR
export const ssrGetPosts = async () => {
  try {
    const posts = await Post.find().sort({ "createdAt": -1 })
    return posts
  } catch (error) {
    console.log(error)
    return error
  }
}

//SSR
export const ssrGetUsersPosts = async (userId) => {
  try {
    console.log("looking for posts from ", userId)
    const posts = await Post.find(
      { "author.id": userId }
    ).sort({ "createdAt": -1 })
    console.log("posts found, ", posts)
    return posts
  } catch (error) {
    console.log(error)
    return error
  }
}

//SSR
export const ssrGetUsers = async () => {
  try {
    const users = await User.find().sort({ "createdAt": -1 })
    return users
  } catch (error) {
    console.log(error)
    return error
  }
}
