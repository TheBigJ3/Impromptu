import React, { useEffect } from 'react'
import CreatePopupMain from '../Components/Website/CreatePopup/CreatePopupMain'
import ToolCard from '../Components/Website/Home/ToolCard'

function getPosition(index) {
  const yPattern = [0, -40, -62, -40, 0];
  const rotationPattern = [-4, -2, 0, 2, 4];

  const i = index % yPattern.length;

  return {
    yOffset: yPattern[i],
    rotation: rotationPattern[i]
  };
}

const Home = () => {
    return (
        <div className='relative mt-[100px] grid grid-cols-5 space-y-10 hide-scrollbar'>

            {Array.from({length:50}).map((_,i) => {
                const {yOffset,rotation} = getPosition(i%5)
                return (
                <div style={{rotate: `${rotation}deg`, transform: `translateY(${yOffset}px)`}} className='flex items-center justify-center toolcardWrapper'>
                    <ToolCard/>
                </div>
                )
            })}

        </div>
    )
}

export default Home