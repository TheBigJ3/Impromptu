import clsx from "clsx";
import { motion, useAnimate } from "motion/react";
import React, { useState } from "react";
import { usePopup } from "../../../Contexts/PopupContext";

const STORAGE_KEY = "Popups"

export async function getAllPopups() {
    const obj = await chrome.storage.local.get(STORAGE_KEY);
    return obj[STORAGE_KEY] || {};
}


const TitleBox = () => {
  const [Characters, setCharacters] = useState(0);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[27px]">Title</span>
        <span className="font-semibold text-[13px] text-[#757575]">
          Give your tool card a catchy name
        </span>
      </div>

      <input
        type="text"
        name="Title"
        id="Title"
        placeholder="Pirate-ify"
        required
        minLength={5}
        onChange={(e) => setCharacters(e.target.value.length)}
        maxLength={25}
        className="h-[40px] w-full rounded-[8px] border-[1.5px] border-[#D9D9D9] p-[5px] text-[14px] placeholder:text-[#BCBCBC]"
        style={{
          backgroundImage:
            "radial-gradient(584.62% 50% at 50% 50%, #FFF 0%, #F5F5F5 100%)",
        }}
      />
      <span className="text-[#A4A3A3] text-[10px] font-semibold">
        {Characters}/25 Characters
      </span>
    </div>
  );
};

const PromptBox = () => {
  const [Characters, setCharacters] = useState(0);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[27px]">Prompt</span>
        <span className="font-semibold text-[13px] text-[#757575]">
          Describe this tool card's job
        </span>
      </div>

      <textarea
        maxLength={250}
        name="Prompt"
        id="Prompt"
        required
        minLength={10}
        onChange={(e) => setCharacters(e.target.value.length)}
        placeholder="Rewrite in the style of a pirate"
        className="min-h-[150px] max-h-[300px] w-full rounded-[8px] border-[1.5px] border-[#D9D9D9] p-[5px] text-[14px] placeholder:text-[#BCBCBC]"
        style={{
          backgroundImage:
            "radial-gradient(584.62% 50% at 50% 50%, #FFF 0%, #F5F5F5 100%)",
        }}
      ></textarea>
      <span className="text-[#A4A3A3] text-[10px] font-semibold">
        {Characters}/250 Characters
      </span>
    </div>
  );
};

const InjectionBox = () => {
  const [Characters, setCharacters] = useState(0);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-[27px]">Use case</span>
        <span className="font-semibold text-[13px] text-[#757575]">
          When to call this tool card
        </span>
      </div>

      <textarea
        maxLength={250}
        name="InjectionBox"
        id="InjectionBox"
        onChange={(e) => setCharacters(e.target.value.length)}
        required
        minLength={10}
        placeholder="When I'm emailing to my fellow matey's, emails ending in @ahoy.com"
        className="min-h-[150px] w-full rounded-[8px] border-[1.5px] border-[#D9D9D9] p-[5px] text-[14px] placeholder:text-[#BCBCBC]"
        style={{
          backgroundImage:
            "radial-gradient(584.62% 50% at 50% 50%, #FFF 0%, #F5F5F5 100%)",
        }}
      ></textarea>
      <span className="text-[#A4A3A3] text-[10px] font-semibold">
        {Characters}/250 Characters
      </span>
    </div>
  );
};

const CreatePopupMain = () => {
  const [openPopup,closePopup] = usePopup()
  const [BoxColor, setBoxColor] = useState("#000");

  function normalize(t) {
    return (t || "").toLowerCase().trim();
  }


  async function onSubmit(e) {
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries());

    const key = normalize(data.Title)
    const popups = await getAllPopups();
    popups[key] = {
      ...data,
      updatedAt: Date.now()
    };

    await chrome.storage.local.set({ [STORAGE_KEY]: popups });
    window.location.href = "?noAnimation=true"
    closePopup()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}

      className="w-full h-full relative flex items-center justify-center overflow-hidden popup-overlay"
    >
      <motion.button onClick={()=> closePopup()} whileHover={{scale:1.1}} whileTap={{scale:.9}} className="cursor-pointer absolute left-[15%] h-[100px] aspect-square">
        <img src="/Icons/XCircle.svg" alt="" className=""  />
      </motion.button>

      <motion.button form="PromptForm" type="submit" whileHover={{scale:1.1}} whileTap={{scale:.9}} className="cursor-pointer absolute right-[15%] h-[100px] aspect-square">
        <img src="/Icons/CheckCircle.svg" alt="" className=""  />
      </motion.button>

      {/* FORM */}
      <form
        id="PromptForm"
        transition={{ duration: 0.2 }}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(e)
        }}
        className="w-full h-full overflow-y-auto max-w-[542px] max-h-[85%] flex flex-col items-center rounded-[35px] bg-[#FFFFFF] px-[40px] py-[50px] gap-[2%]"
      >
        {/* Box Color */}
        <div
          className="relative h-[100px] aspect-square rounded-[8px] shrink-0"
          style={{
            background: BoxColor,
            boxShadow: "0 0 8.2px 3px rgba(0, 0, 0, 0.25)",
          }}
        >
          <input
            type="color"
            name="BoxColor"
            id="BoxColor"
            onChange={(e) => setBoxColor(e.target.value)}
            className="absolute h-full w-full opacity-0"
          />
        </div>

        <TitleBox />
        <PromptBox />
        <InjectionBox />
      </form>
    </motion.div>
  );
};

export default CreatePopupMain;