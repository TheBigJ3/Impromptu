import { motion, useAnimate } from 'motion/react'
import React, { useEffect } from 'react'

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const TitleLoadingAnimation = ({onComplete}) => {
    const [scope,animate] = useAnimate()

    useEffect(() => {
        async function run() {
            animate('.f1, .f2, .f3',{left : '8%'},{duration:0})
            await delay(500)
            animate('.f1',{left : '8%'},{duration:.3})
            animate('.f2',{left : '10%'},{duration:.3})
            animate('.f3',{left : '13%'},{duration:.3})
            
            animate('.textimg',{maskImage:'linear-gradient(90deg, #000 100%, #0000 0%)'},{duration : .45, delay:.02, ease:'linear'})
            animate('.f1',{left : '80%'},{duration:.5, ease:'linear'})
            animate('.f2',{left : '82.5%'},{duration:.5,ease:'linear'})
            await animate('.f3',{left : '85.5%'},{duration:.5,ease:'linear'})

            await delay(500)

            animate('.f1',{left : '80%'},{duration:.2, ease:'linear'})
            animate('.f2',{left : '80%'},{duration:.3,ease:'linear'})
            await animate('.f3',{left : '80%'},{duration:.4,ease:'linear'})
        }

        run().then(async () => {
            await delay(500)
            animate('.f1',{opacity : 0},{duration:.2, ease:'linear'})
            animate('.f2',{opacity : 0},{duration:.3,ease:'linear'})
            await animate('img',{opacity:0})
            onComplete()
        })
    }, [])
    
    // 13 11 8
    return (
        <div ref={scope} className='relative aspect-[276/91] w-full -translate-1/2 left-1/2 top-1/2 p-[40px] flex items-center gap-2'>
            <img style={{maskImage :'linear-gradient(90deg, #000 0%, #0000 0%)'}} src="/Logo/Impromptu.svg" alt="" className='textimg w-full object-contain' />

            <img src="/Logo/Icon.svg" alt="" className='h-[70%] object-contain relative -translate-y-1/2 top-[25%] opacity-0' />

            <motion.img src="/Logo/IconFrame1.svg" alt="" className='f1 f h-[36%] absolute top-[27%] left-[8%]'/>
            <motion.img src="/Logo/IconFrame2.svg" alt="" className='f2 f h-[36%] absolute top-[27%] left-[8%]'/>
            <motion.img src="/Logo/IconFrame3.svg" alt="" className='f3 f h-[36%] absolute top-[27%] left-[8%]'/>
        </div>
    )
}

export default TitleLoadingAnimation