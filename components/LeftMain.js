import HomeIcon from '@mui/icons-material/Home';
import LeftOption from './LeftOption';
import PeopleIcon from '@mui/icons-material/People';
import FeedIcon from '@mui/icons-material/Feed';
import GroupsIcon from '@mui/icons-material/Groups';
import StoreIcon from '@mui/icons-material/Store';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AppsIcon from '@mui/icons-material/Apps';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from '@mui/material';


function MainLeft() {

  const { data: session } = useSession()

  return (
    <div className="fixed w-[25vw] h-[100vh] pt-12 flex flex-col overflow-y-hidden hover:overflow-y-scroll hover:scrollbar-hidden  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <LeftOption Icon={HomeIcon} title={"Home"} />
      {session ? (
        <Link href={`/${session?.user?.id.slice(0, 17)}`}>
          <LeftOption imgSrc={session?.user?.image || "https://louisville.edu/enrollmentmanagement/images/person-icon/image"} title={session?.user?.name} />
        </Link>
      ) : (
        <Link href={`/000`}>
          <div className='cursor-pointer flex items-center space-x-3 px-3 py-2 hover:bg-stone-700 transform ease-out duration-100'>
            <Avatar className='w-6 h-6 ' />
            <p className=" bg-transparent whitespace-nowrap overflow-clip" >{"Guest User"}</p>
          </div>
        </Link>
      )}

      <LeftOption Icon={PeopleIcon} title={"Friends"} />
      <LeftOption Icon={FeedIcon} title={"Most Recent"} />
      <LeftOption Icon={GroupsIcon} title={"Groups"} />
      <LeftOption Icon={StoreIcon} title={"Marketplace"} />
      <LeftOption Icon={OndemandVideoIcon} title={"Watch"} />
      <LeftOption Icon={AppsIcon} title={"See all"} />
      <br />
      <LeftOption Icon={LocationCityIcon} title={"San Francisco News"} />
      <LeftOption Icon={LocationCityIcon} title={"Events San Francisco"} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Clubs "} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Meetups "} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Restaurants"} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Coffee"} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Shopping"} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Hiking"} />
      <LeftOption Icon={PeopleIcon} title={"San Francisco Foodies"} />

    </div>
  )
}

export default MainLeft