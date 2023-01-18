import CreateIcon from '@mui/icons-material/Create';
import { useDispatch } from 'react-redux';
import { toggleOpen } from '../redux/messageSlice';


function NewMessageButton() {

  const dispatch = useDispatch()

  return (
    <div
      onClick={() => dispatch(toggleOpen())}
      className=" fixed bg-stone-600 w-10 h-10 p-2 rounded-full right-3 bottom-3 z-50 cursor-pointer hover:bg-stone-500"
    >
      <CreateIcon className="  bg-transparent mb-2 " />
    </div>

  )
}

export default NewMessageButton