import { motion } from 'motion/react'
import React from 'react'
import { SummaryMainElement } from './Summary/SummaryMain'
import LoadingAnimation, { LoadingAnimationComponent } from "../Global/LoadingAnimation"


const CommandPopup = () => {

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:100}} className='w-screen h-screen pointer-events-none'>
            <SummaryMainElement/>
            <div className='absolute bottom-[10px] right-2.5 w-[80px] h-[80px]'>
                <LoadingAnimationComponent/>
            </div>
        </motion.div>
    )
}

export default CommandPopup