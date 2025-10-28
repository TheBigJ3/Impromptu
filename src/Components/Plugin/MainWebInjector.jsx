import { motion } from 'motion/react'
import React from 'react'
import { SummaryMainElement } from './Summary/SummaryMain'


const CommandPopup = () => {

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:100}} className='w-screen h-screen pointer-events-none'>
            <SummaryMainElement/>
        </motion.div>
    )
}

export default CommandPopup