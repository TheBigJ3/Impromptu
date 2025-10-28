import React from 'react'

const SettingsShowAutoCard = () => {
  return (
    <div className='flex justify-between border-t-[1px] border-[#D9D9D9] px-[40px] py-[30px]'>

        <div className='flex flex-col text-[14px] gap-[5px]'>
            <span>Show AutoCard On Screen </span>
            <span className='text-[#808080] text-[12px]'>Displays the automatically chosen Tool Card on screen. </span>
        </div>
    </div>
  )
}

export default SettingsShowAutoCard