import { getGPUTier } from 'detect-gpu';
import * as _ from 'lodash'
import { Canvas } from '@react-three/fiber'
import React, { useState, useEffect } from 'react'
import Scene from './Scene.js'
import { Center } from '@react-three/drei'

export function App() {
  const [gpuTier, setGpuTier] = useState()
  const [randomizeTrigger, setTrigger] = useState()

  useEffect(() => {
    (async () => {
      const gpu = await getGPUTier();
      setGpuTier(gpu)
    })()
  }, [])

  return (
  <>
    <div style={{height: '100%', zIndex: 0, }}>

    <Canvas camera={{ position: [5, 3, -10], zoom: 4, near: 1, far: 1000 }} >

    <Center>
      {/* put everything into a component inside Canvas, to avoid the R3F Hooks warning - this provides the Canvas context */}
      <Scene {... {gpuTier, randomizeTrigger}} />
    </Center>
    </Canvas>
  </div>
  </>

)
}
