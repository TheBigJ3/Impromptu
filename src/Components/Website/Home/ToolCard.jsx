import { motion } from 'motion/react'
import React from 'react'


const ToolCard = ({BoxColor, Title}) => {
  return (
    <motion.div whileTap={{scale:.98, y:0}} whileHover={{scale:1.05,y:-10}} className='w-[150px] h-[250px] bg-[#FFFFFF] border border-[#D9D9D9] rounded-[10px] cursor-pointer'>
        
    </motion.div>
  )
}

export default ToolCard