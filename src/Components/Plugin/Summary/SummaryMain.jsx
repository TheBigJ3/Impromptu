import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

const SummaryMainVariants = {
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

// external controls (safe if component not mounted yet)
function show() {
  setStateRef?.((s) => ({ ...s, showElement: true }));
}
function hide() {
  setStateRef?.((s) => ({ ...s, showElement: false }));
}
function setText(text) {
  setStateRef?.((s) => ({ ...s, textElement: text }));
}


export const SummaryMainElement = () => {
  const [state, setState] = useState({
    showElement: false,
    textElement: `Hello <b>Loser</b>`,
  });

  // register this single instance
  useEffect(() => {
    setStateRef = setState;
    return () => {
      setStateRef = null;
    };
  }, []);

  const { showElement, textElement } = state;

  return (
    <motion.div initial={{opacity:0,scale:0}} animate={showElement ? "show" : "hide"} variants={SummaryMainVariants} className='absolute top-[10px] right-[10px] w-[336px] min-h-[560px] bg-[#dbdbdb] border border-[#595959] rounded-[22px] flex flex-col px-[20px] pb-[20px] gap-[5px] pointer-events-auto'>
      <div className='w-full h-[44px] flex items-start justify-end p-[5px] relative'>

          <motion.button onClick={hide} whileHover={{scale:1.1}} whileTap={{scale:.98}} className='w-[32px] aspect-square flex items-center justify-center absolute top-[10px] right-[-10px]'>
            <img src={chrome.runtime.getURL("Icons/XCircle.svg")} alt="" className='w-full aspect-square object-contain' />
          </motion.button>

      </div>

      <h1 className='w-full flex items-center justify-center'>
        <span className='font-semibold text-[34px] text-black'>Summary</span>
      </h1>

      <div dangerouslySetInnerHTML={{__html: textElement}} className='border-[1px] border-[#D9D9D9] rounded-[8px] bg-[#F9F9F9] flex-1 overflow-auto mt-[10px] text-[12px] text-black p-[10px] max-h-[560px]'>

      </div>
    </motion.div>
  )
}

export default  {
  show,
  hide,
  setText
}

