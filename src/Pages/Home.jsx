import React, { useEffect, useState } from 'react'
import CreatePopupMain, { getAllPopups } from '../Components/Website/CreatePopup/CreatePopupMain'
import ToolCard from '../Components/Website/Home/ToolCard'

const STORAGE_KEY = "Popups"

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
    const [Prompts, setPrompts] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const obj = await getAllPopups();
        setPrompts(Object.values(obj)); 
      }

      fetchData()
    }, [])
    

    return (
        <div className='relative mt-[100px] grid grid-cols-5 space-y-10 hide-scrollbar'>

            {Prompts.map((v,i) => {
                const {yOffset,rotation} = getPosition(i%5)
                console.log(v)
                return (
                <div style={{rotate: `${rotation}deg`, transform: `translateY(${yOffset}px)`}} className='flex items-center justify-center toolcardWrapper'>
                    <ToolCard BoxColor={v?.BoxColor} Title={v?.Title}/>
                </div>
                )
            })}

        </div>
    )
}

export default Home