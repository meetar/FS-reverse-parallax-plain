import { GemRandomizer } from './GemRandomizer.js'
import { OrbitControls } from '@react-three/drei'

export default function Scene(config) {
  return (
    <>
      <GemRandomizer {...config} />
      <OrbitControls autoRotate={config.config.rotate} autoRotateSpeed={-1} zoomSpeed={.5} dampingFactor={0.3} enableZoom={true} enableRotate={true} enablePan={false} />
    </>
  )
}