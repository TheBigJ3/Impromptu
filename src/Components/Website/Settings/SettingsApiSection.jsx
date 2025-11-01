import { motion } from 'motion/react';
import React from 'react'
import SettingsRemoveKey from './SettingsRemoveKey';

const SettingsApiSection = () => {

    function toggleVisibility() {
        const APIKey_input = document.querySelector("#APIKEY");
        const currentType = APIKey_input.getAttribute("type");
        const newType = currentType === "password" ? "text" : "password";

        APIKey_input.setAttribute("type",newType)
    }


    return (
        <div className='flex w-full flex-col gap-[20px] p-[40px]'>
            <div className='flex text-[14px] justify-between'>
                <span>API Key</span>

                <div className='flex gap-[5px]'>
                    <input id='APIKEY' type="password" placeholder='Paste your API key here ' className='outline-none w-[292px] placeholder:text-[#808080] h-[30px] rounded-[5px] border border-[#808080] text-[12px] p-[10px]' />
                    <button onClick={toggleVisibility} className='h-[30px] aspect-square border border-[#808080] rounded-[5px] flex items-center justify-center cursor-pointer'>
                        <img src="/Icons/Hide.svg" alt="" />
                    </button>
                </div>
            </div>

            <div className='flex justify-between'>
                <div className='flex flex-col text-[14px] text-[#0B99FF]'>
                    <span className='italic'>To get an API key:</span>
                    <span className='mt-[5px] ml-[5px] italic'> 1. Go to <u>Google AI Studio</u></span>
                    <span className='mt-[5px] ml-[5px] italic'> 2. Sign in or create an account</span>
                    <span className='mt-[5px] ml-[5px] italic'> 3. Click on “Get API key”</span>
                    <span className='mt-[5px] ml-[5px] italic'> 4. Copy and paste your key here</span>
                </div>

                <SettingsRemoveKey/>
            </div>
        </div>
  )
}

export default SettingsApiSection