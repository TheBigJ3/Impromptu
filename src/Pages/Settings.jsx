import React from 'react'
import SettingsTop from '../Components/Website/Settings/SettingsTop'
import SettingsApiSection from '../Components/Website/Settings/SettingsApiSection'
import SettingsDarkModeSection from '../Components/Website/Settings/SettingsDarkModeSection'
import SettingsShowAutoCard from '../Components/Website/Settings/SettingsShowAutoCard'
import SettingsKeyboardShortcut from '../Components/Website/Settings/SettingsKeyboardShortcut'
import SettingsReset from '../Components/Website/Settings/SettingsReset'

const Settings = () => {
  return (
    <div className='w-full flex flex-col px-[10px]'>
        <SettingsTop/>

        <div className='w-full h-auto bg-white rounded-[36px] border border-[#D9D9D9] mt-[50px]'>
          <SettingsApiSection/>
          <SettingsDarkModeSection/>
          <SettingsShowAutoCard/>
          <SettingsKeyboardShortcut/>
          <SettingsReset/>
        </div>
    </div>
  )
}

export default Settings