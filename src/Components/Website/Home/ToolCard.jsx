import { motion } from 'motion/react'
import React from 'react'
import { getAllPopups } from '../CreatePopup/CreatePopupMain'

function normalize(t) {
  return (t || "").toLowerCase().trim();
}

const ToolCard = ({BoxColor, Title,id}) => {

  async function deletePopup() {
    // Implement delete functionality here
    const obj = await getAllPopups()

    delete obj[normalize(Title)]

    await chrome.storage.local.set({Popups: obj})
    window.location.href = "?noAnimation=true"
  }

  return (
    <motion.div whileTap={{scale:.98, y:0}} whileHover={{scale:1.05,y:-10}} className='w-[150px] h-[250px] bg-[#FFFFFF] border border-[#D9D9D9] rounded-[10px] cursor-pointer flex flex-col items-center p-[15px] gap-[10px]'>
        <div
          className="relative w-[100px] h-[100px] rounded-[8px] shrink-0"
          style={{
            background: BoxColor,
            boxShadow: "0 0 8.2px 3px rgba(0, 0, 0, 0.25)",
          }}/>

          <span className='text-[18px] text-black font-bold'>{Title}</span>

          <motion.button onClick={deletePopup} className='w-full h-[40px] bg-[#EC4D3B] font-medium text-white text-[16px] mt-auto rounded-[8px] cursor-pointer'>
            Delete
          </motion.button>
    </motion.div>
  )
}

export default ToolCard