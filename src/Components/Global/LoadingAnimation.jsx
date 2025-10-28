import { motion, useAnimate } from 'motion/react'
import React, { useEffect } from 'react'

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const LoadingAnimation = () => {
    const [scope, animate] = useAnimate()

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            animate('img',{left: '50%'},{duration : 0})

            await delay(500)
            
            animate('.f1',{left:'30%'},{duration: .3})
            animate('.f2',{left:'47%'},{duration: .3})
            await animate('.f3',{left:'70%'},{duration: .3})


            await delay(500)

            await animate('img',{left:'50%'},{duration:.3})
        }

        async function init() {
            while (!cancelled) {
                await run()
            }
        }

        init()
        

        return () => cancelled = true
    }, [animate])
     
    // 30% 50% 70%

    return (
        <div ref={scope} className='absolute aspect-[28/26] w-full -translate-1/2 left-1/2 top-1/2'> 
            <motion.img src="/Logo/IconFrame1.svg" alt="" className='f1 f h-full absolute top-1/2 left-[50%] -translate-1/2' />
            <motion.img src="/Logo/IconFrame2.svg" alt="" className='f2 f h-full absolute top-1/2 left-[50%] -translate-1/2' />
            <motion.img src="/Logo/IconFrame3.svg" alt="" className='f3 f h-full absolute top-1/2 left-[50%] -translate-1/2'/>
        </div>
    )
}

export default LoadingAnimation