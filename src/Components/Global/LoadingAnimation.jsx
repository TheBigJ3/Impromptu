import { motion, useAnimate } from 'motion/react'
import React, { useEffect, useState } from 'react'

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const LoadingVariant = {
  show : {
    opacity : 1,
    scale: 1
  },
  hide : {
    opacity : 0,
    scale: 0
  }
}

let setStateRef = null;

function show() {
  setStateRef?.((s) => ({ ...s, showElement: true }));
}
function hide() {
  setStateRef?.((s) => ({ ...s, showElement: false }));
}

export const LoadingAnimationComponent = () => {
    const [state, setState] = useState({ showElement: false })
    const [scope, animate] = useAnimate()

    useEffect(() => {
        setStateRef = setState;
        return () => {
        setStateRef = null;
        };
    }, []);

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
        <motion.div variants={LoadingVariant} initial="hide" animate={state.showElement ? "show" : "hide"} ref={scope} className='absolute aspect-[28/26] w-full -translate-1/2 left-1/2 top-1/2'> 
            <motion.img src={chrome.runtime.getURL("Logo/IconFrame1.svg")} alt="" className='f1 f h-full absolute top-1/2 left-[50%] -translate-1/2' />
            <motion.img src={chrome.runtime.getURL("Logo/IconFrame2.svg")} alt="" className='f2 f h-full absolute top-1/2 left-[50%] -translate-1/2' />
            <motion.img src={chrome.runtime.getURL("Logo/IconFrame3.svg")} alt="" className='f3 f h-full absolute top-1/2 left-[50%] -translate-1/2'/>
        </motion.div>
    )
}

export default  {
  show,
  hide,
}

