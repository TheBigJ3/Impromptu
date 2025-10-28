import React from "react";
import HoverButton from "../../Global/HoverButton";

const SettingsReset = () => {
  return (
    <div className="flex justify-between border-t-[1px] border-[#D9D9D9] items-center px-[40px] py-[30px]">
      <div className="flex flex-col text-[14px] gap-[5px]">
        <span>Reset Impromptu </span>
        <span className="text-[#808080] text-[12px]">
          This will remove all saved Tool Cards and settings. This action cannot
          be undone.
        </span>
      </div>

      <HoverButton color={"#FF383C"} title={"Reset"}/>
    </div>
  );
};

export default SettingsReset;
