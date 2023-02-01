import { useSession } from "next-auth/react";
import NewMessageButton from "./NewMessageButton"
import RightUser from "./RightUser"

function MainRight({ users }) {


  const { data: session } = useSession()

 
  return (
    <div className="hidden fixed right-0 top-0 w-[25vw] h-[100vh] pt-12 lg:flex flex-col overflow-y-hidden hover:overflow-y-scroll hover:scrollbar-hidden  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ">

      <p className=" mt-2 px-2 pb-2">Contacts</p>

      {session && users.filter(user => user.id !== session?.user?.id.substring(0, 17)).map(user => (
        <RightUser key={user.id} id={user.id} user={user} name={user.name} image={user.image} />
      ))}
      {!session && users.filter(user => user.id !== "000").map(user => (
        <RightUser key={user.id} id={user.id} user={user} name={user.name} image={user.image} />
      ))}

      {/* <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} />
      <RightUser name={"Example User"} /> */}


      <NewMessageButton />

    </div>
  )
}

export default MainRight