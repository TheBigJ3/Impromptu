import React from 'react'
import HoverButton from '../../Global/HoverButton'

const SettingsKeyboardShortcut = () => {
  return (
    <div className='flex justify-between border-t-[1px] border-[#D9D9D9] px-[40px] py-[30px] items-center'>

        <div className='flex flex-col text-[14px] gap-[5px]'>
            <span>Keyboard Shortcut</span>
            <span className='text-[#808080] text-[12px]'>Defaults to <span className='text-[#0B99FF]'>⌥ + Space</span>. Avoid accidentally overwriting existing shortcuts in chrome.  </span>
        </div>

        <div className='flex gap-[5px]'>
          <HoverButton color={"#0B99FF"} title={"Revert to default"}/>
        </div>
    </div>
  )
}

export default SettingsKeyboardShortcut