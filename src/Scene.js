import { isBrowser } from 'react-device-detect';
import { EffectComposer, Bloom, Pixelation } from '@react-three/postprocessing'
import { SoftShadows } from '@react-three/drei'
import { useState, useEffect } from 'react'
import { randomControls } from './randomControls'
import { GemRandomizer } from './GemRandomizer.js'

import { OrbitControls } from '@react-three/drei'
import { useControls, button } from 'leva'


export default function Scene({gpuTier, gemDone, randomizeTrigger}) {
  const [trigger, setTrigger] = useState()

  // animate out and make a new one
  useEffect(() => {
    setTrigger(['randomize', Math.random()])
}, [randomizeTrigger])

if (!gpuTier) return false;

return (
      <>
        <GemRandomizer
          { ...{gpuTier, trigger}}
          config={randomControls}
          />

        {/** Controls */}
        <OrbitControls autoRotate={true} autoRotateSpeed={-1} zoomSpeed={.5} dampingFactor={0.3} enableRotate={true} enablePan={true} />

      </>
      )
}