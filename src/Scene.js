import { GemRandomizer } from './GemRandomizer.js'
import { OrbitControls } from '@react-three/drei'

export default function Scene() {
  return (
    <>
      <GemRandomizer />
      <OrbitControls autoRotate={true} autoRotateSpeed={-1} zoomSpeed={.5} dampingFactor={0.3} enableZoom={false} enableRotate={true} enablePan={false} />
    </>
  )
}