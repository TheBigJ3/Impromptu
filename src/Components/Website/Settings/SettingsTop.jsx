import { motion } from "motion/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SettingsTop = () => {
  const nav = useNavigate()

  return (
    <div className="w-full flex justify-between">
      <motion.div className="flex gap-[10px]">
        {/* <img src="/Icons/BlueLeftArrow.svg" alt="" /> */}
        <h1 className="text-[#0B99FF] text-[25px]">Settings</h1>
      </motion.div>
      <img src="/Icons/BlueCheck.svg" alt="" />
    </div>
  );
};

export default SettingsTop;
