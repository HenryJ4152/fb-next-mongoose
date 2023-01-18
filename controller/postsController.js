import mongoose from 'mongoose'
import Post from '../models/Post'


// GET /api/posts
export const getAllPosts = async (req, res) => {

  try {
    const posts = await Post.find({}).sort({ "createdAt": -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.status(400).json({ success: false })
  }
}

// GET /api/posts/[userId]
// need to set api this way bc GET requests cannot have a body, so userId needs to be passed in query params
export const getUserPosts = async (req, res) => {

  const userId = req.query.userId
  try {
    const posts = await Post.find(
      { "author.id": userId }
    ).sort({ "createdAt": -1 })
    res.status(200).json(posts)
  } catch (error) {
    res.status(400).json({ success: false })
  }
}



// POST /api/posts
export const postAPost = async (req, res) => {

  try {
    const post = await Post.create(req.body)
    res.status(201).json(post)
  } catch (error) {
    res.status(400).json({ success: false })
  }
}


// DELETE /api/posts
export const deleteAPost = async (req, res) => {

  const postId = req.body.postId
  if (!postId) res.status(400).json({ success: false, message: "postId not found in request" })
  try {
    const post = await Post.findByIdAndDelete(postId)
    res.status(201).json({ delete: "successful", ...post })
  } catch (error) {
    res.status(400).json({ success: false })
  }
}


// PUT /api/posts    updating text and like 
export const updateAPost = async (req, res) => {

  try {
    console.log("req.body: ", req.body)
    const postId = req.body.postId
    //changing postText
    const updatedText = req.body.updatedText
    //changing like/remove like
    const toggleLikeId = req.body.toggleLikeId
    const addFlag = req.body.addFlag //addFlag = add like
    //changing post's comment
    const commentId = req.body.commentId
    const comment = req.body.comment
    const updatedComment = comment?.comment
    const addDeleteUpdate = req.body.addDeleteUpdate


    let updatedPost

    if (updatedText) {
      updatedPost = await Post.findByIdAndUpdate(postId, {
        text: updatedText,
      }, { new: true })
    }
    else if (toggleLikeId) {
      if (addFlag) {

        updatedPost = await Post.findByIdAndUpdate(postId,
          { "$push": { "likes": toggleLikeId } },
          { new: true }
        )
      } else {
        updatedPost = await Post.findByIdAndUpdate(postId,
          { "$pull": { "likes": toggleLikeId } },
          { new: true }
        )
      }
    } else if (addDeleteUpdate) {
      if (addDeleteUpdate === "DELETE") {
        const updatedPost = await Post.findByIdAndUpdate(postId,
          { "$pull": { "comments": comment } },
          { new: true }
        )
        res.status(201).json({ update: "successfully updated comments", ...updatedPost })

      } else if (addDeleteUpdate === "ADD") {
        const updatedPost = await Post.findByIdAndUpdate(postId,
          { "$push": { "comments": comment } },
          { new: true }
        )
        res.status(201).json({ update: "successfully updated comments", ...updatedPost })

      } else if (addDeleteUpdate === "UPDATE") {
        //!!!inside the comments array each item has an _id field even tho not shown in mongo
        const updatedPost = await Post.findOneAndUpdate(
          { _id: postId, comments: { $elemMatch: { _id: commentId } } },
          { $set: { 'comments.$.comment': updatedComment } },
          { 'new': true, 'safe': true, 'upsert': true }
        );
        //find doc by _id postId, go into comments field find items where its _id matches commentId
        //change the comment field to updatedComment in the selected $item(whose _id is commentId) in the comments array 
        // doc > comments array > comment item > comment field with the text
        res.status(201).json({ update: "successfully updated comments", ...updatedPost })

      } else {
        res.status(400).json({ message: "addDeleteUpdate must be set to ADD DELETE or UPDATE" })
      }
    }

    //this is sent if comment was not changed
    res.status(201).json({ update: "successfully updated post", ...updatedPost })
  } catch (error) {
    res.status(400).json(error.message)
  }
}



//this was used for updating comments in post. code moved to updateAPost()
// // PUT /api/posts/[postId]   updating comments
// export const updatePost = async (req, res) => {
//   try {
//     console.log(req.body);
//     const postId = req.query.postId
//     const comment = req.body.comment
//     const updatedComment = comment.comment
//     // console.log(comment);

//     const commentId = req.body.commentId
//     const addDeleteUpdate = req.body.addDeleteUpdate
//     // comment: {
//     //    name:
//     //    profilePic:
//     //    comment:
//     // }

//     let option
//     if (addDeleteUpdate === "DELETE") {
//       const updatedPost = await Post.findByIdAndUpdate(postId,
//         { "$pull": { "comments": comment } },
//         { new: true }
//       )
//       res.status(201).json({ update: "successfully updated comments", ...updatedPost })

//     } else if (addDeleteUpdate === "ADD") {
//       const updatedPost = await Post.findByIdAndUpdate(postId,
//         { "$push": { "comments": comment } },
//         { new: true }
//       )
//       res.status(201).json({ update: "successfully updated comments", ...updatedPost })

//     } else if (addDeleteUpdate === "UPDATE") {
//       //!!!inside the comments array each item has an _id field even tho not shown in mongo
//       const updatedPost = await Post.findOneAndUpdate({ _id: postId, comments: { $elemMatch: { _id: commentId } } },
//         { $set: { 'comments.$.comment': updatedComment } },
//         { 'new': true, 'safe': true, 'upsert': true });
//       //find doc by _id postId, go into comments field find items where its _id matches commentId
//       //change the comment field to updatedComment in the selected $item(whose _id is commentId) in the comments array
//       // doc > comments array > comment item > comment field with the text
//       res.status(201).json({ update: "successfully updated comments", ...updatedPost })

//     } else {
//       res.status(400).json({ message: "addDeleteUpdate must be set to ADD DELETE or UPDATE" })
//     }


//   } catch (error) {
//     res.status(400).json(error.message)

//   }
// }
