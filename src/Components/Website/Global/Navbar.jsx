import { motion } from 'motion/react'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePopup } from '../../../Contexts/PopupContext'
import CreatePopupMain from '../CreatePopup/CreatePopupMain'

const Navbar = () => {
  const [showPopup] = usePopup()
  const nav = useNavigate()

  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className='w-full h-[65px] p-[10px] flex justify-between'>
      <motion.button onClick={() => nav('/')} whileTap={{scale:.98, y:0}} whileHover={{scale:1.02,y:-3}} className='cursor-pointer'>
        <img src="/Logo/IconText.svg" alt="" />
      </motion.button>


      <div className='flex gap-[10px] h-full'>
        <motion.button onClick={() => showPopup(<CreatePopupMain/>)} whileTap={{scale:.98, y:0}} whileHover={{scale:1.02, y:-3, opacity:100, rotate:100}} className='cursor-pointer opacity-70'>
            <img src="/Icons/AddBox.png" alt="" className='h-[60%]'/>        
        </motion.button>
        {location.pathname !== "/settings" && (
          <motion.button onClick={() => nav('/settings')}  whileTap={{scale:.98, y:0}} whileHover={{scale:1.02, y:-3, opacity:100, rotate:100}} className='cursor-pointer opacity-70'>
            <img src="/Icons/Settings.svg" alt="" className='h-[70%]' />
          </motion.button>
        )}
      </div>

    </div>
  )
}

export default Navbar