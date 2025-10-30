
import { useState } from "react";
import TitleLoadingAnimation from "./Components/Global/TitleLoadingAnimation";
import Navbar from "./Components/Website/Global/Navbar";
import { motion } from "motion/react";
import { Outlet } from "react-router-dom";

function App() {
  const skipAnimation = new URLSearchParams(window.location.search).get("noAnimation") === "true";
  if (skipAnimation && !window.__skipAnimationHandled) {
    window.__skipAnimationHandled = true;
    setTimeout(() => {
      if (typeof setAnimationFinished === "function") setAnimationFinished(true);
    }, 0);
  }

  const [AnimationFinished, setAnimationFinished] = useState(window.__skipAnimationHandled || false);

  if (!AnimationFinished)
    return (
      <>
        <div className="w-full h-dvh flex flex-col justify-between overflow-hidden bg-white relative">
          <div className="patterncontainer absolute inset-0" />
          <div className="w-full h-full relative">
            <div className="w-[500px] aspect-square -translate-1/2 left-1/2 top-1/2 relative">
              <TitleLoadingAnimation
                onComplete={() => setAnimationFinished(true)}
              />
            </div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <div className="w-full h-dvh overflow-visible bg-white relative flex justify-center">
        <div className="patterncontainer absolute inset-0 z-0 pointer-events-none" />

        <motion.div animate={{opacity:1}} transition={{duration:.3,delay:.3}} className="w-full max-w-[930px] flex flex-col items-center pt-[75px] pb-[10px] opacity-0 overflow-visible">
          <Navbar />
          <main className="w-full relative overflow-y-scroll hide-scrollbar main-scroll">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </>
  );
}

export default App;
