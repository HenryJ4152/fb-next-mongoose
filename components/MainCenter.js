import { useSession } from "next-auth/react"
import { useQuery } from "react-query"
import { fetchAllPosts } from "../utils/helpers"
import CreatePostContainer from "./CreatePostContainer"
import Post from "./Post"
import StoriesContainer from "./StoriesContainer"



function MainCenter({ posts }) {


  const { isLoading, error, data } = useQuery('posts', fetchAllPosts)
  const { data: session } = useSession()

  // console.log(posts);
  // console.log(data);

  // if (isLoading) return 'Loading...'

  // if (error) return 'An error has occurred: ' + error.message

  // if (data) console.log(data)

  return (
    <div className=" w-full   py-12 flex flex-col   items-center  ">
      <div className=" w-[40vw]   flex flex-col  items-center">

        <StoriesContainer />
        <CreatePostContainer />

        {error &&
          <div className=" mb-4">Error fetching posts. {error.message}</div>
        }
        {
          data ? (
            data?.map(({ _id, author, comments, likes, text }) => (
              <Post key={_id} postId={_id} author={author} comments={comments} likes={likes} text={text} />
            ))
          ) : (
            posts?.map(({ _id, author, comments, likes, text }) => (
              <Post key={_id} postId={_id} author={author} comments={comments} likes={likes} text={text} />
            ))
          )
        }

      </div>
    </div>
  )

}

export default MainCenter